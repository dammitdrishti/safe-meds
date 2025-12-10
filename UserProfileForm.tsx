import React, { useState } from 'react';
import { UserProfile } from '../types';
import { COMMON_CONDITIONS, COMMON_ALLERGIES } from '../constants';
import { User, Heart, AlertTriangle, Pill, Check, Plus, ArrowRight } from 'lucide-react';

interface Props {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const UserProfileForm: React.FC<Props> = ({ initialProfile, onSave }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');

  const toggleItem = (list: string[], item: string): string[] => {
    return list.includes(item)
      ? list.filter(i => i !== item)
      : [...list, item];
  };

  const handleSave = () => {
    onSave(profile);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Your Health Profile</h1>
        <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">
          Tell us about yourself so we can personalize safety warnings for every medication you scan.
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-card border border-white/50 relative overflow-hidden backdrop-blur-sm">
        <div className="p-8 sm:p-12 space-y-12 relative z-10">
          
          {/* Section 1: Basic Stats */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User className="w-4 h-4 text-medical-500" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 ml-1">Age</label>
                <input
                  type="number"
                  placeholder="e.g. 30"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-medical-500 rounded-2xl px-5 py-4 text-slate-900 outline-none transition-all font-semibold shadow-sm focus:shadow-md text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 ml-1">Gender</label>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                  {['Male', 'Female', 'Other'].map((opt) => {
                    const val = opt.toLowerCase();
                    const isSelected = profile.gender === val;
                    return (
                      <button
                        key={val}
                        onClick={() => setProfile({ ...profile, gender: val as any })}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                          isSelected 
                            ? 'bg-white text-medical-600 shadow-md transform scale-[1.02]' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100"></div>

          {/* Section 2: Conditions */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" /> Medical Conditions
            </h3>
            <div className="flex flex-wrap gap-3">
              {COMMON_CONDITIONS.map(condition => {
                const isActive = profile.conditions.includes(condition);
                return (
                  <button
                    key={condition}
                    onClick={() => setProfile({ ...profile, conditions: toggleItem(profile.conditions, condition) })}
                    className={`group px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 border ${
                      isActive
                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200 translate-y-[-2px]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {condition}
                      {isActive && <Check className="w-4 h-4" />}
                    </span>
                  </button>
                );
              })}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Plus className="h-4 w-4 text-slate-400 group-focus-within:text-medical-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Add other..."
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCondition) {
                      setProfile({ ...profile, conditions: [...profile.conditions, newCondition] });
                      setNewCondition('');
                    }
                  }}
                  className="pl-10 pr-4 py-3 rounded-2xl border border-dashed border-slate-300 bg-transparent hover:bg-slate-50 focus:bg-white focus:border-medical-500 focus:border-solid outline-none text-sm font-medium w-40 transition-all focus:w-64 focus:shadow-md"
                />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100"></div>

          {/* Section 3: Allergies */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Allergies
            </h3>
            <div className="flex flex-wrap gap-3">
              {COMMON_ALLERGIES.map(allergy => {
                const isActive = profile.allergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    onClick={() => setProfile({ ...profile, allergies: toggleItem(profile.allergies, allergy) })}
                    className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 border ${
                      isActive
                        ? 'bg-amber-100 border-amber-200 text-amber-900 shadow-md translate-y-[-2px]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {allergy}
                      {isActive && <Check className="w-4 h-4 text-amber-600" />}
                    </span>
                  </button>
                );
              })}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Plus className="h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Add allergy..."
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newAllergy) {
                      setProfile({ ...profile, allergies: [...profile.allergies, newAllergy] });
                      setNewAllergy('');
                    }
                  }}
                  className="pl-10 pr-4 py-3 rounded-2xl border border-dashed border-slate-300 bg-transparent hover:bg-slate-50 focus:bg-white focus:border-amber-500 focus:border-solid outline-none text-sm font-medium w-40 transition-all focus:w-64 focus:shadow-md"
                />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100"></div>

          {/* Section 4: Meds */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Pill className="w-4 h-4 text-indigo-500" /> Current Medications
            </h3>
            <div className="relative">
              <textarea
                placeholder="List any medications you currently take (e.g., Lisinopril, Multivitamins)..."
                value={profile.medications.join(', ')}
                onChange={(e) => setProfile({ ...profile, medications: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-medical-500 rounded-2xl p-5 text-base text-slate-800 outline-none transition-all min-h-[120px] resize-none leading-relaxed shadow-sm focus:shadow-lg placeholder:text-slate-400"
              />
              <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-medium pointer-events-none bg-white/80 px-2 py-1 rounded-md">
                Separate with commas
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full btn-primary text-white font-bold text-lg py-5 rounded-2xl shadow-xl shadow-medical-500/30 transition-all transform hover:-translate-y-1 mt-6 flex items-center justify-center gap-3 group"
          >
            Save Profile & Start Scanning
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;