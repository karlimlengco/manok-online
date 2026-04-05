import { Link } from '@tanstack/react-router';
import { Menu, MenuButton, MenuItem, MenuItems, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import {
    Bars3Icon,
    XMarkIcon,
    ShoppingCartIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../lib/auth';
import { getCart } from '../lib/api';

const navLinks = [
    { to: '/' as const, label: 'Home' },
    { to: '/products' as const, label: 'Products' },
];

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();

    const { data: cart } = useQuery({
        queryKey: ['cart'],
        queryFn: getCart,
        enabled: isAuthenticated,
    });

    const cartCount = cart?.items_count ?? 0;

    return (
        <Disclosure as="nav" className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-2">
                                <span className="text-2xl">🐓</span>
                                <span className="text-xl font-bold text-amber-700">
                                    Manok Online
                                </span>
                            </Link>

                            {/* Desktop nav links */}
                            <div className="hidden sm:flex sm:items-center sm:gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="text-sm font-medium text-gray-700 hover:text-amber-700"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Right side */}
                            <div className="flex items-center gap-4">
                                {/* Cart */}
                                <Link
                                    to="/cart"
                                    className="relative text-gray-600 hover:text-amber-700"
                                >
                                    <ShoppingCartIcon className="h-6 w-6" />
                                    {cartCount > 0 && (
                                        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </Link>

                                {/* User menu (desktop) */}
                                <div className="hidden sm:block">
                                    {isAuthenticated ? (
                                        <Menu as="div" className="relative">
                                            <MenuButton className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-amber-700">
                                                <UserCircleIcon className="h-6 w-6" />
                                                <span className="max-w-[8rem] truncate">
                                                    {user?.name}
                                                </span>
                                            </MenuButton>
                                            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                                <MenuItem>
                                                    {({ focus }) => (
                                                        <Link
                                                            to="/orders"
                                                            search={{ page: 1 }}
                                                            className={`block px-4 py-2 text-sm ${focus ? 'bg-gray-100' : ''} text-gray-700`}
                                                        >
                                                            My Orders
                                                        </Link>
                                                    )}
                                                </MenuItem>
                                                <MenuItem>
                                                    {({ focus }) => (
                                                        <button
                                                            onClick={() => logout()}
                                                            className={`block w-full px-4 py-2 text-left text-sm ${focus ? 'bg-gray-100' : ''} text-gray-700`}
                                                        >
                                                            Logout
                                                        </button>
                                                    )}
                                                </MenuItem>
                                            </MenuItems>
                                        </Menu>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <Link
                                                to="/login"
                                                className="text-sm font-medium text-gray-700 hover:text-amber-700"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/register"
                                                className="rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
                                            >
                                                Register
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Mobile hamburger */}
                                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 sm:hidden">
                                    {open ? (
                                        <XMarkIcon className="h-6 w-6" />
                                    ) : (
                                        <Bars3Icon className="h-6 w-6" />
                                    )}
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 px-4 pb-3 pt-2">
                            {navLinks.map((link) => (
                                <DisclosureButton
                                    key={link.to}
                                    as={Link}
                                    to={link.to}
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    {link.label}
                                </DisclosureButton>
                            ))}
                            <hr className="my-2" />
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/orders"
                                        search={{ page: 1 }}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        My Orders
                                    </Link>
                                    <DisclosureButton
                                        as="button"
                                        onClick={() => logout()}
                                        className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </DisclosureButton>
                                </>
                            ) : (
                                <>
                                    <DisclosureButton
                                        as={Link}
                                        to="/login"
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        Login
                                    </DisclosureButton>
                                    <DisclosureButton
                                        as={Link}
                                        to="/register"
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        Register
                                    </DisclosureButton>
                                </>
                            )}
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
}
