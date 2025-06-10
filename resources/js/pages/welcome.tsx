import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function ChatBot() {
    const { t, i18n } = useTranslation();
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState<'eng' | 'ita'>('eng'); 

    useEffect(() => {
        setMessages([]);
        setQuestion('');
        setLoading(false);
    }, [language]);

    const formatConversation = (msgs: Message[]) =>
        msgs.map((m) => `${m.role === 'user' ? t('user') : t('assistant')}: ${m.content}`).join('\n');

    const askQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        const newUserMsg: Message = { role: 'user', content: question };
        const updatedMessages = [...messages, newUserMsg];
        setMessages(updatedMessages);
        setQuestion('');
        setLoading(true);

        try {
            const conversationText = formatConversation(updatedMessages);

            const res = await axios.post('/chatbot', {
                question: conversationText,
                language: language
            });

            const answer: Message = { role: 'assistant', content: res.data.answer };
            setMessages((prev) => [...prev, answer]);
        } catch (error) {
            const errMsg: Message = {
                role: 'assistant',
                content: 'Errore nel contattare il server.',
            };
            setMessages((prev) => [...prev, errMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>

            <div className="mb-4">
                <label htmlFor="language" className="block mb-1 font-medium">
                    {t('selectLanguage')}:
                </label>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => {
                        setLanguage(e.target.value as 'eng' | 'ita');
                        i18n.changeLanguage(e.target.value);
                    }}
                    className="border px-3 py-2 rounded w-full"
                >
                    <option value="eng">{t('english')}</option>
                    <option value="ita">{t('italian')}</option>
                </select>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-3 rounded ${
                            msg.role === 'user'
                                ? 'bg-blue-100 text-right'
                                : 'bg-gray-100 text-left'
                        }`}
                    >
                        <p>
                            <strong>{msg.role === 'user' ? t('you') : t('assistant')}:</strong>{' '}
                            {msg.content}
                        </p>
                    </div>
                ))}
            </div>
            <form onSubmit={askQuestion} className="flex gap-2">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t('questionInput')}
                    className="flex-1 px-4 py-2 border rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? '...' : t('sendButton')}
                </button>
            </form>
        </div>
    );
}
