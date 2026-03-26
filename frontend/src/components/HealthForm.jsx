import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HeartPulse, Droplets, Activity, Send } from 'lucide-react';
import { addVitals } from '../store/slices/healthSlice';

const HealthForm = ({ patientId }) => {
  const [formData, setFormData] = useState({
    heartRate: '',
    oxygen: '',
    bpSystolic: '',
    bpDiastolic: ''
  });
  const dispatch = useDispatch();

  const onChange = (e) => setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(addVitals({ patientId, ...formData }));
    setFormData({ heartRate: '', oxygen: '', bpSystolic: '', bpDiastolic: '' });
  };

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
        <HeartPulse className="h-8 w-8 text-primary-600" />
        <span>Record Vitals</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Heart Rate (bpm)</label>
          <div className="relative">
            <HeartPulse className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-500" />
            <input
              type="number"
              name="heartRate"
              value={formData.heartRate}
              onChange={onChange}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="72"
              min="30"
              max="200"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Oxygen Level (%)</label>
          <div className="relative">
            <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
            <input
              type="number"
              name="oxygen"
              value={formData.oxygen}
              onChange={onChange}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="98"
              min="70"
              max="100"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Systolic BP (mmHg)</label>
          <div className="relative">
            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
            <input
              type="number"
              name="bpSystolic"
              value={formData.bpSystolic}
              onChange={onChange}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="120"
              min="70"
              max="250"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Diastolic BP (mmHg)</label>
          <div className="relative">
            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
            <input
              type="number"
              name="bpDiastolic"
              value={formData.bpDiastolic}
              onChange={onChange}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="80"
              min="40"
              max="150"
              required
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-3 text-lg"
      >
        <Send className="h-6 w-6" />
        <span>Record Vitals</span>
      </button>
    </form>
  );
};

export default HealthForm;

