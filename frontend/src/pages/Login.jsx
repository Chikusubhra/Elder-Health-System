import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, getMe } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading: authLoading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const onChange = (e) => setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(login(formData)).unwrap();
      await dispatch(getMe());
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-blue-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            Elder Health Monitor
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        <form onSubmit={onSubmit} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 border border-white/50">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>{loading || authLoading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account? <a href="/register" className="text-primary-600 hover:text-primary-700 font-medium">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

