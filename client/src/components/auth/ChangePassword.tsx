/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import api from '../../utils/api';
import { FiLock, FiEye, FiEyeOff, FiKey, FiShield } from 'react-icons/fi';

const ChangePassword: React.FC = () => {
  const [step, setStep] = useState<'request' | 'change'>('request');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await api.post('/auth/change-password/request-otp');
      showMessage('OTP sent to your email!', 'success');
      setStep('change');
      startResendTimer();
    } catch (error: any) {
      console.error('Request OTP error:', error);
      const errorMessage =
        error.response?.data?.error ?? 'Failed to send OTP. Please try again.';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };


  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword || !otp) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    if (otp.length !== 6) {
      showMessage('Please enter a valid 6-digit OTP', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showMessage('New password must be at least 8 characters long', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage('New passwords do not match', 'error');
      return;
    }

    if (currentPassword === newPassword) {
      showMessage('New password must be different from current password', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
        otp,
      });
      showMessage('Password changed successfully!', 'success');
      
      // Reset form
      setTimeout(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setOtp('');
        setStep('request');
      }, 2000);
    } catch (error: any) {
      console.error('Change password error:', error);
      const errorMessage =
        error.response?.data?.error ?? 'Failed to change password. Please try again.';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    try {
      await api.post('/auth/change-password/request-otp');
      showMessage('OTP resent to your email!', 'success');
      startResendTimer();
      setOtp('');
    } catch (error: any) {
      showMessage('Failed to resend OTP. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-full p-3 mr-4">
              <FiShield className="text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Change Password</h2>
              <p className="text-blue-100 mt-1">
                {step === 'request' 
                  ? 'Secure your account with a new password' 
                  : 'Enter OTP and your new password'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                messageType === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
              {message}
            </div>
          )}

          {/* Step 1: Request OTP */}
          {step === 'request' && (
            <form onSubmit={handleRequestOTP} className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <FiKey className="text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">
                      Verification Required
                    </h3>
                    <p className="text-sm text-blue-700">
                      For security purposes, we'll send a verification code to your registered email address.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}>
                {loading ? 'Sending OTP...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {/* Step 2: Change Password Form */}
          {step === 'change' && (
            <form onSubmit={handleChangePassword} className="space-y-5">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-center text-xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    disabled={loading}
                  />
                </div>
                <div className="mt-2 text-sm text-center">
                  {resendTimer > 0 ? (
                    <span className="text-gray-600">
                      Resend OTP in {resendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-500 font-medium">
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter current password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                    {showCurrentPassword ? (
                      <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? (
                      <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (
                      <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <ul className="space-y-1">
                  <li>• Password must be at least 8 characters long</li>
                  <li>• New password must be different from current password</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('request');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setOtp('');
                  }}
                  className="flex-1 py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                  disabled={loading}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}>
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;