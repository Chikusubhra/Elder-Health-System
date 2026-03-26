import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, getMe } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'child' 
  });
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
      await dispatch(register(formData)).unwrap();
      await dispatch(getMe());
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent mb-2">
            Join Elder Health Monitor
          </h1>
          <p className="text-gray-600">Create your account</p>
        </div>
        <form onSubmit={onSubmit} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 border border-white/50">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>
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
                minLength={6}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="care_manager">Care Manager</option>
              <option value="parent">Parent</option>
              <option value="child">Child</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading || authLoading ? 'Creating account...' : 'Create Account'}</span>
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;

