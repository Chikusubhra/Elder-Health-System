import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, logoutUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Droplets, Activity, AlertCircle, Bell, LogOut, Phone, PhoneCall, User, CheckCircle2, XCircle,
  HeartPulse, Users, Plus 
} from 'lucide-react';
  import { fetchPatients, fetchVitals, toggleWorkable } from '../store/slices/healthSlice';
  import { fetchAlerts } from '../store/slices/alertSlice';

import HealthForm from '../components/HealthForm';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { patients, latestVitals, isLoading: healthLoading } = useSelector((state) => state.health);
  const { alerts, isLoading: alertsLoading } = useSelector((state) => state.alerts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [viewHistoryPatient, setViewHistoryPatient] = useState(null);

  const rolePermissions = {
    care_manager: ['addHealth', 'viewAll'],
    parent: ['emergency', 'viewOwn'],
    child: ['viewOwn', 'viewHealth']
  };

  const hasPermission = (permission) => rolePermissions[user.role]?.includes(permission);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(logout());
    navigate('/login');
  };

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchPatients());
    dispatch(fetchAlerts()); // Add this
  }, [dispatch, user]);

  const handleToggleWorkable = (patientId) => {
    dispatch(toggleWorkable(patientId));
  };

  const handleAddVitals = (patient) => {
    setSelectedPatient(patient);
    setShowVitalsModal(true);
  };

  const handleViewHistory = (patient) => {
    setViewHistoryPatient(patient);
    dispatch(fetchVitals(patient._id));
  };

  const closeModal = () => {
    setShowVitalsModal(false);
    setSelectedPatient(null);
    setViewHistoryPatient(null);
  };

  // Auto refresh data after vitals add or navigation
  useEffect(() => {
    if (viewHistoryPatient?._id) {
      dispatch(fetchVitals(viewHistoryPatient._id));
    } else if (user?.role === 'child' || user?.role === 'parent') {
      dispatch(fetchVitals(user._id));
    } else if (user?.role === 'care_manager' && patients.length > 0) {
      dispatch(fetchVitals(patients[0]._id));
    }
  }, [dispatch, user, patients, viewHistoryPatient, latestVitals]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Elder Health Dashboard</h1>
              <p className="text-sm text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Heart Rate</p>
                <p className="text-2xl font-bold text-gray-900">{latestVitals?.heartRate || '--'} bpm</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Oxygen</p>
                <p className="text-2xl font-bold text-gray-900">{latestVitals?.oxygen || '--'}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Blood Pressure</p>
                <p className="text-2xl font-bold text-gray-900">{latestVitals?.bpSystolic || '--'}/{latestVitals?.bpDiastolic || '--'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alerts</p>
          <p className="text-2xl font-bold text-gray-900">{alerts?.length || 0}</p>
            <p className="text-xs text-gray-500 mt-1">{alertsLoading ? 'Loading...' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patients List for Care Manager */}
        {(hasPermission('viewAll') || user.role === 'child') && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                {(user.role === 'child') ? (
                  <>
                    <HeartPulse className="h-8 w-8" />
                    <span>My Health Data</span>
                  </>
                ) : (
                  <>
                    <Users className="h-8 w-8" />
                    <span>Patients ({patients.length})</span>
                  </>
                )}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Health Metric</th>
                    {(user.role !== 'child') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>}
                    {(user.role !== 'child') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {user.role === 'child' ? (
                    patients.map((patient) => patient.role === 'child' && (
                      <tr key={patient._id} className="hover:bg-gray-50">
                        <td colSpan={(user.role !== 'child') ? 3 : 1} className="px-6 py-4">
                          <div className="text-lg font-bold text-gray-900">Child View - View your own health data below (history table)</div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    patients.map((patient) => (
                      <tr key={patient._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <User className="h-10 w-10 text-gray-300" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900">{patient.name}</div>
                              <div className="text-sm text-gray-500">{patient.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                            patient.workable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {patient.workable ? 'Workable' : 'On Hold'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleToggleWorkable(patient._id)}
                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50"
                            title="Toggle Workable"
                          >
                            {patient.workable ? <XCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                          </button>
                          <button
                            onClick={() => handleAddVitals(patient)}
                            className="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 font-semibold shadow-lg transition-all"
                          >
                            <Plus className="h-4 w-4 inline mr-1" />
                            Vitals
                          </button>
                          <button
                            onClick={() => handleViewHistory(patient)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                            title="View History"
                          >
                            <HeartPulse className="h-5 w-5" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50" title="Call">
                            <Phone className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {hasPermission('addHealth') && (
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <h3 className="text-lg font-bold mb-2">Add Health Data</h3>
              <p className="opacity-90 mb-4 text-sm">Record new vitals for patient</p>
              <button 
                onClick={() => patients[0] && handleAddVitals(patients[0])}
                className="bg-white text-primary-600 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 active:scale-95 transition-all shadow-lg text-lg w-full hover:scale-105 duration-200"
              >
                + Add Vitals
              </button>
            </div>
          )}

  {hasPermission('emergency') && (
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <h3 className="text-lg font-bold mb-2">Emergency</h3>
              <p className="opacity-90 mb-4 text-sm">View emergency alerts & own vitals data</p>
              <button className="bg-white text-red-600 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 active:scale-95 transition-all shadow-lg font-bold text-lg w-full hover:scale-105 duration-200">
                🚨 VIEW DATA & ALERTS
              </button>
            </div>
          )}

          <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Recent Activity</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {alerts.length > 0 ? (
                alerts.slice(0, 5).map((alert) => (
                  <div key={alert._id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{alert.message}</p>
                      <p className="text-xs text-gray-500">{new Date(alert.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <Bell className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">No recent alerts</p>
                    <p className="text-xs text-gray-500">Everything looks good</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Health History */}
        {viewHistoryPatient && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <HeartPulse className="h-8 w-8" />
                <span>Health History - {viewHistoryPatient.name}</span>
              </h3>
              <button onClick={() => setViewHistoryPatient(null)} className="text-gray-500 hover:text-gray-700">
                × Close
              </button>
            </div>
            {healthLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-gray-200 rounded-xl"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Heart Rate</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Oxygen</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">BP</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {latestVitals ? latestVitals.slice(0, 10).map((vital) => (
                      <tr key={vital._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vital.heartRate} bpm</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vital.oxygen}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vital.bpSystolic}/{vital.bpDiastolic}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(vital.timestamp).toLocaleDateString()}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">No vitals data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vitals Modal */}
      {showVitalsModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add Vitals - {selectedPatient.name}</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100">
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <HealthForm patientId={selectedPatient._id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

