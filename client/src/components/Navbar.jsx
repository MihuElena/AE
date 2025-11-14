import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { logout } from '../store/slices/userSlice'
import { fetchCart } from '../store/slices/cartSlice'
import { classNames } from '../utils/tailwind'

const navigation = [
  { name: 'Homepage', href: '/' },
  { name: 'Products', href: '/products' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const loggedIn = useSelector((state) => state.user.loggedIn)
  const user = useSelector((state) => state.user.user)
  const isAdmin = user?.role === 'admin'

  const cartItems = useSelector((state) => state.cart?.items || [])
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    if (loggedIn && !isAdmin) {
      dispatch(fetchCart())
    }
  }, [loggedIn, isAdmin, dispatch])

  const isActive = (href) => location.pathname === href
  const handleAuthClick = () => {
    if (loggedIn) {
      dispatch(logout())
      navigate('/')
    } else {
      navigate('/login')
    }
  }
  const handleCartClick = () => navigate('/cart')

  return (
    <Disclosure as="nav" className="fixed w-full z-50 backdrop-blur-md bg-black/30 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:bg-white/10 hover:text-white focus:outline-none">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block h-6 w-6 group-data-open:hidden" />
              <XMarkIcon className="hidden h-6 w-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* Logo & navigation */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                alt="Your Brand"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-10 w-auto"
              />
            </Link>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={classNames(
                    isActive(item.href)
                      ? 'bg-white/20 text-white'
                      : 'text-gray-200 hover:bg-white/10 hover:text-white',
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right buttons */}
          <div className="absolute inset-y-0 right-0 flex items-center gap-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Cart for normal users */}
            {loggedIn && !isAdmin && (
              <button
                onClick={handleCartClick}
                className="relative rounded-full p-1 text-gray-200 hover:text-white focus:outline-none"
              >
                <span className="sr-only">View cart</span>
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white shadow">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
                <span className="sr-only">Open user menu</span>
                <UserCircleIcon className="h-8 w-8 text-gray-200 hover:text-white transition-colors duration-200" />
              </MenuButton>

              <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <MenuItem>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''} text-gray-700`}
                    >
                      Your Profile
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <Link
                      to="/settings"
                      className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''} text-gray-700`}
                    >
                      Settings
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleAuthClick}
                      className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''} text-gray-700`}
                    >
                      {loggedIn ? 'Sign Out' : 'Sign In'}
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <DisclosurePanel className="sm:hidden bg-black/50 backdrop-blur-md">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.href}
              className={classNames(
                isActive(item.href)
                  ? 'bg-white/20 text-white'
                  : 'text-gray-200 hover:bg-white/10 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
