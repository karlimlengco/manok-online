import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '../lib/auth';

export const Route = createFileRoute('/register')({
    component: RegisterPage,
});

function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(false);

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setGeneralError('');
        setLoading(true);
        try {
            await register(form);
            navigate({ to: '/' });
        } catch (err: any) {
            if (err?.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            } else {
                setGeneralError(
                    err?.response?.data?.message ?? 'Registration failed. Please try again.',
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const fieldError = (field: string) =>
        errors[field] ? (
            <p className="mt-1 text-xs text-red-600">{errors[field][0]}</p>
        ) : null;

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                    <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
                        Create your account
                    </h1>

                    {generalError && (
                        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                            {generalError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={form.name}
                                onChange={set('name')}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            {fieldError('name')}
                        </div>

                        <div>
                            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="reg-email"
                                type="email"
                                required
                                value={form.email}
                                onChange={set('email')}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            {fieldError('email')}
                        </div>

                        <div>
                            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="reg-password"
                                type="password"
                                required
                                value={form.password}
                                onChange={set('password')}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            {fieldError('password')}
                        </div>

                        <div>
                            <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="password-confirm"
                                type="password"
                                required
                                value={form.password_confirmation}
                                onChange={set('password_confirmation')}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Register'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-amber-600 hover:text-amber-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
