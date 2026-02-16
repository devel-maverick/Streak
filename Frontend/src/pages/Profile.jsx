import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import {
    MapPin, Github, Linkedin, Edit2,
    Plus, CheckCircle, Clock
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
import axiosInstance from '../api/axios';

const PLATFORMS = [
    { id: 'leetcode', name: 'LeetCode', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png' },
    { id: 'codeforces', name: 'CodeForces', icon: 'https://cdn.iconscout.com/icon/free/png-256/free-codeforces-3628695-3029920.png' },
    { id: 'codechef', name: 'CodeChef', icon: 'https://static-00.iconduck.com/assets.00/codechef-icon-380x512-r1v87w22.png' }
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export default function Profile() {
    const { user, checkAuth } = useAuthStore();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [cfStats, setCfStats] = useState(null);
    const [cfRatingHistory, setCfRatingHistory] = useState([]);

    const [selectedPlatform, setSelectedPlatform] = useState('leetcode'); // Default to LeetCode
    const [formData, setFormData] = useState({
        name: '',
        leetcodeUsername: '',
        codeforcesUsername: '',
        codechefUsername: '',
        githubUrl: '',
        linkedinUrl: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                leetcodeUsername: user.leetcodeUsername || '',
                codeforcesUsername: user.codeforcesUsername || '',
                codechefUsername: user.codechefUsername || '',
                githubUrl: user.githubUrl || '',
                linkedinUrl: user.linkedinUrl || ''
            });

            if (user.codeforcesUsername) {
                fetchCodeforcesData(user.codeforcesUsername);
            }
        }
    }, [user]);

    const fetchCodeforcesData = async (handle) => {
        try {
            const infoRes = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
            if (infoRes.data.status === 'OK') {
                setCfStats(infoRes.data.result[0]);
            }
            const ratingRes = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
            if (ratingRes.data.status === 'OK') {
                const history = ratingRes.data.result.map(r => ({
                    contest: r.contestName,
                    rating: r.newRating,
                    date: new Date(r.ratingUpdateTimeSeconds * 1000).toLocaleDateString()
                }));
                setCfRatingHistory(history.slice(-15));
            }
        } catch (err) {
            console.error("CF Fetch Error", err);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            await axiosInstance.put('/auth/profile', formData);
            await checkAuth();
            setIsEditOpen(false);
            toast.success("Profile updated successfully");
        } catch (err) {
            console.error("Update failed", err);
            toast.error("Failed to update profile");
        }
    };



    const ActivityHeatmap = ({ platform }) => {
        const [calendarData, setCalendarData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            const fetchSubmissionData = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const response = await fetch(
                        `http://localhost:3000/api/stats/submission-activity/${platform}`,
                        { credentials: 'include' }
                    );

                    if (!response.ok) {
                        throw new Error('Failed to fetch submission data');
                    }

                    const data = await response.json();
                    const convertedCalendar = {};
                    Object.entries(data.calendar || {}).forEach(([timestamp, count]) => {
                        const date = new Date(parseInt(timestamp) * 1000);
                        const dateString = date.toISOString().split('T')[0];
                        convertedCalendar[dateString] = count;
                    });

                    setCalendarData(convertedCalendar);
                } catch (error) {
                    console.error('Failed to fetch submission data:', error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchSubmissionData();
        }, [platform]);

        const generateHeatmapData = () => {
            const data = [];
            const today = new Date();

            for (let i = 364; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateString = date.toISOString().split('T')[0];

                const count = calendarData?.[dateString] || 0;

                data.push({
                    date: dateString,
                    count: count,
                    level: count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 8 ? 3 : 4,
                    platform: platform
                });
            }
            return data;
        };

        if (loading) {
            return (
                <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">Loading submission activity...</div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center h-32">
                    <div className="text-red-500">Failed to load submission activity</div>
                </div>
            );
        }

        const heatmapData = generateHeatmapData();

        const weeks = [];
        let currentWeek = [];
        const startDay = new Date(heatmapData[0].date).getDay();
        for (let i = 0; i < startDay; i++) {
            currentWeek.push(null);
        }

        heatmapData.forEach((day, index) => {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });

        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
        }

        const getMonthLabels = () => {
            const monthLabels = [];
            let currentMonth = null;

            weeks.forEach((week, weekIndex) => {
                const firstDayOfWeek = week.find(d => d !== null);
                if (!firstDayOfWeek) return;

                const date = new Date(firstDayOfWeek.date);
                const month = date.getMonth();
                const year = date.getFullYear();
                const monthKey = `${year}-${month}`;

                if (monthKey !== currentMonth) {
                    currentMonth = monthKey;
                    monthLabels.push({
                        weekIndex,
                        label: date.toLocaleDateString('en-US', { month: 'short' })
                    });
                }
            });

            return monthLabels;
        };

        const monthLabels = getMonthLabels();

        const colors = [
            'bg-gray-200 dark:bg-gray-800',
            'bg-green-200 dark:bg-green-900',
            'bg-green-400 dark:bg-green-700',
            'bg-green-600 dark:bg-green-500',
            'bg-green-700 dark:bg-green-400'
        ];

        const dayLabels = ['Mon', 'Wed', 'Fri'];
        const dayIndices = [1, 3, 5];

        return (
            <div className="flex gap-2">
                <div className="flex flex-col gap-[3px] text-xs text-gray-500 pr-2" style={{ paddingTop: '20px' }}>
                    {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                        const labelIndex = dayIndices.indexOf(dayIndex);
                        return (
                            <div key={dayIndex} className="h-[13px] flex items-center">
                                {labelIndex !== -1 ? dayLabels[labelIndex] : ''}
                            </div>
                        );
                    })}
                </div>

                <div className="flex-1 overflow-x-auto">
                    <div className="relative mb-1" style={{ height: '16px' }}>
                        {monthLabels.map((monthLabel, index) => (
                            <div
                                key={index}
                                className="absolute text-xs text-gray-500"
                                style={{
                                    left: `${monthLabel.weekIndex * 16}px`,
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {monthLabel.label}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-[3px]">
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-[3px]">
                                {week.map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className={`w-[13px] h-[13px] rounded-sm ${day ? colors[day.level] : 'bg-gray-100 dark:bg-gray-900'
                                            }`}
                                        title={day ? `${day.count} ${platform} submissions on ${day.date}` : ''}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
                        <span>Less</span>
                        {colors.map((color, i) => (
                            <div key={i} className={`w-[13px] h-[13px] rounded-sm ${color}`} />
                        ))}
                        <span>More</span>
                    </div>
                </div>
            </div>
        );
    };

    const PlatformList = () => {
        const platformStats = {
            leetcode: user?.solvedLeetcode || 0,
            codeforces: user?.solvedCodeforces || 0,
            codechef: user?.solvedCodechef || 0
        };

        return (
            <div className="space-y-4">
                {PLATFORMS.map(platform => {
                    const handleKey = `${platform.id}Username`;
                    const handle = user?.[handleKey];
                    const solved = platformStats[platform.id];
                    const isSelected = selectedPlatform === platform.id;

                    if (!handle) return null;

                    return (
                        <button
                            key={platform.id}
                            onClick={() => setSelectedPlatform(platform.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition ${isSelected
                                ? 'bg-gray-100 border-black'
                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <img src={platform.icon} alt={platform.name} className="w-6 h-6 object-contain" />
                                <div className="flex flex-col items-start">
                                    <span className={`text-sm font-medium ${isSelected ? 'text-black' : 'text-gray-800'
                                        }`}>{platform.name}</span>
                                    <span className="text-xs text-gray-500">
                                        {handle} • {solved} solved
                                    </span>
                                </div>
                            </div>
                            {isSelected && <CheckCircle size={16} className="text-black" />}
                        </button>
                    )
                })}
            </div>
        );
    };

    if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-900">Loading...</div>;

    const leetcodeSolved = user.solvedLeetcode || 0;
    const codeforcesSolved = user.solvedCodeforces || 0;
    const codechefSolved = user.solvedCodechef || 0;
    const totalQuestions = user.totalSolved || 0;
    const leetcodeEasy = user.leetcodeEasy || 0;
    const leetcodeMedium = user.leetcodeMedium || 0;
    const leetcodeHard = user.leetcodeHard || 0;

    const pieData = [
        { name: 'Easy', value: leetcodeEasy, color: '#10B981' },
        { name: 'Medium', value: leetcodeMedium, color: '#F59E0B' },
        { name: 'Hard', value: leetcodeHard, color: '#EF4444' }
    ].filter(item => item.value > 0);

    if (pieData.length === 0) {
        pieData.push(
            { name: 'Easy', value: 76, color: '#10B981' },
            { name: 'Medium', value: 50, color: '#F59E0B' },
            { name: 'Hard', value: 7, color: '#EF4444' }
        );
    }

    const renderPlatformContent = () => {
        switch (selectedPlatform) {
            case 'leetcode':
                if (!user.leetcodeUsername) return <div className="text-gray-500 text-center py-12">LeetCode not connected</div>;
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-gray-600 text-sm font-medium">Total Solved</h3>
                                <div className="text-4xl font-bold mt-2 text-gray-900">{leetcodeSolved}</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-gray-600 text-sm font-medium">Rating</h3>
                                <div className="text-4xl font-bold mt-2 text-orange-600">{Math.round(user.leetcodeRating) || 'N/A'}</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-gray-600 text-sm font-medium">Ranking</h3>
                                <div className="text-3xl font-bold mt-2 text-black">
                                    {user.leetcodeRanking ? `#${user.leetcodeRanking.toLocaleString()}` : 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold mb-4 text-gray-900">Submission Activity</h3>
                            <ActivityHeatmap platform="leetcode" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold mb-4 text-gray-900">Difficulty Breakdown</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm font-medium text-green-700">Easy</span>
                                        <span className="text-2xl font-bold text-green-600">{leetcodeEasy}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                        <span className="text-sm font-medium text-orange-700">Medium</span>
                                        <span className="text-2xl font-bold text-orange-600">{leetcodeMedium}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                        <span className="text-sm font-medium text-red-700">Hard</span>
                                        <span className="text-2xl font-bold text-red-600">{leetcodeHard}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold mb-4 text-gray-900">Visual Distribution</h3>
                                <div className="h-48 w-full relative flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                innerRadius={40}
                                                outerRadius={60}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 'codeforces':
                if (!user.codeforcesUsername) return <div className="text-gray-500 text-center py-12">Codeforces not connected</div>;
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-gray-600 text-sm font-medium">Problems Solved</h3>
                                <div className="text-4xl font-bold mt-2 text-gray-900">{codeforcesSolved}</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-gray-600 text-sm font-medium">Current Rating</h3>
                                <div className="text-4xl font-bold mt-2 text-black">{user.codeforcesRating || 0}</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-gray-600 text-sm font-medium">Max Rating</h3>
                                <div className="text-4xl font-bold mt-2 text-purple-600">{user.codeforcesMaxRating || 0}</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-gray-600 text-sm font-medium">Rank</h3>
                                <div className="text-2xl font-bold mt-2 text-gray-900 capitalize">{user.codeforcesRank || 'unrated'}</div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold mb-4 text-gray-900">Rating History</h3>
                            <div className="h-64 w-full">
                                {cfRatingHistory.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={cfRatingHistory}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                            <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                                            <Line type="monotone" dataKey="rating" stroke="#000000" strokeWidth={2} dot={{ r: 4, fill: '#000000' }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-500">
                                        <p>No rating history available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold mb-4 text-gray-900">Submission Activity</h3>
                            <ActivityHeatmap platform="codeforces" />
                        </div>
                    </>
                );

            case 'codechef':
                if (!user.codechefUsername) return <div className="text-gray-500 text-center py-12">CodeChef not connected</div>;
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-gray-600 text-sm font-medium">Problems Solved</h3>
                                <div className="text-4xl font-bold mt-2 text-gray-900">{codechefSolved}</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-gray-600 text-sm font-medium">Rating</h3>
                                <div className="text-4xl font-bold mt-2 text-orange-600">{user.codechefRating || 0}</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-gray-600 text-sm font-medium">Stars</h3>
                                <div className="text-4xl font-bold mt-2 text-yellow-600">{user.codechefStars || 'N/A'}</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-gray-600 text-sm font-medium">Streak</h3>
                                <div className="text-4xl font-bold mt-2 text-green-600">{user.currentStreak || 0}</div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold mb-4 text-gray-900">Submission Activity</h3>
                            <ActivityHeatmap platform="codechef" />
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                            <p className="text-gray-800">CodeChef detailed stats integration coming soon!</p>
                        </div>
                    </>
                );

            default:
                return <div className="text-gray-500 text-center py-12">Select a platform to view stats</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <div className="max-w-7xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* LEFT SIDEBAR */}
                <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-900 to-black" />

                        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-3xl font-bold mb-4 border-2 border-gray-200 hover:border-black transition-colors">
                            {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" /> : <span className="text-gray-700">{user.name.charAt(0)}</span>}
                        </div>

                        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                        <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">@{user.email.split('@')[0]}</a>

                        {(user.githubUrl || user.linkedinUrl) && (
                            <div className="mt-4 flex gap-2 justify-center">
                                {user.githubUrl && (
                                    <a
                                        href={user.githubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 bg-gray-50 rounded-lg text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-400 transition"
                                    >
                                        <Github size={18} />
                                    </a>
                                )}
                                {user.linkedinUrl && (
                                    <a
                                        href={user.linkedinUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 bg-gray-50 rounded-lg text-gray-600 hover:text-black border border-gray-200 hover:border-black transition"
                                    >
                                        <Linkedin size={18} />
                                    </a>
                                )}
                                <button onClick={() => setIsEditOpen(true)} className="p-2 bg-gray-50 rounded-lg text-gray-600 hover:text-gray-900 border border-gray-200 transition">
                                    <Edit2 size={18} />
                                </button>
                            </div>
                        )}

                        {!user.githubUrl && !user.linkedinUrl && (
                            <div className="mt-4">
                                <button onClick={() => setIsEditOpen(true)} className="px-4 py-2 bg-gray-50 rounded-lg text-gray-600 hover:text-gray-900 border border-gray-200 transition inline-flex items-center gap-2">
                                    <Edit2 size={16} /> Edit Profile
                                </button>
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                                <MapPin size={14} /> India
                            </div>
                        </div>
                    </div>

                    {/* Problem Solving */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Problem Solving</h3>
                        <PlatformList />
                        <button
                            onClick={() => setIsEditOpen(true)}
                            className="w-full mt-4 py-3 border border-dashed border-gray-300 rounded-xl text-gray-600 hover:text-black hover:border-black hover:bg-gray-50 transition flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> Add Platform
                        </button>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Social</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition">
                                <div className="flex items-center gap-3">
                                    <Github size={20} className="text-gray-700" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-800">GitHub</span>
                                        <span className="text-xs text-gray-500">{user.githubUrl ? 'Connected' : 'Not Connected'}</span>
                                    </div>
                                </div>
                                {user.githubUrl ? (
                                    <a href={user.githubUrl} target="_blank" rel="noreferrer" className="text-black"><CheckCircle size={16} /></a>
                                ) : (
                                    <button onClick={() => setIsEditOpen(true)} className="text-gray-400 hover:text-gray-700"><Plus size={16} /></button>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition">
                                <div className="flex items-center gap-3">
                                    <Linkedin size={20} className="text-gray-700" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-800">LinkedIn</span>
                                        <span className="text-xs text-gray-500">{user.linkedinUrl ? 'Connected' : 'Not Connected'}</span>
                                    </div>
                                </div>
                                {user.linkedinUrl ? (
                                    <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="text-black"><CheckCircle size={16} /></a>
                                ) : (
                                    <button onClick={() => setIsEditOpen(true)} className="text-gray-400 hover:text-gray-700"><Plus size={16} /></button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>




                <div className="lg:col-span-3 space-y-6">
                    {renderPlatformContent()}
                </div>

            </div>

            {isEditOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs text-gray-600">Name</label>
                                <input
                                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-black outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <hr className="border-gray-200" />
                            <h3 className="font-semibold text-gray-900">Problem Solving Platforms</h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-600">Codeforces Handle</label>
                                    <input
                                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-black outline-none"
                                        placeholder="e.g. tourist"
                                        value={formData.codeforcesUsername}
                                        onChange={(e) => setFormData({ ...formData, codeforcesUsername: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-600">LeetCode Username</label>
                                    <input
                                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-black outline-none"
                                        placeholder="e.g. neal_wu"
                                        value={formData.leetcodeUsername}
                                        onChange={(e) => setFormData({ ...formData, leetcodeUsername: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-600">CodeChef Handle</label>
                                    <input
                                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-black outline-none"
                                        placeholder="e.g. admin"
                                        value={formData.codechefUsername}
                                        onChange={(e) => setFormData({ ...formData, codechefUsername: e.target.value })}
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-200" />
                            <h3 className="font-semibold text-gray-900">Social Links</h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-600">GitHub URL</label>
                                    <input
                                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-black outline-none"
                                        placeholder="https://github.com/username"
                                        value={formData.githubUrl}
                                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-600">LinkedIn URL</label>
                                    <input
                                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-black outline-none"
                                        placeholder="https://linkedin.com/in/username"
                                        value={formData.linkedinUrl}
                                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-900">Cancel</button>
                            <button onClick={handleUpdateProfile} className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition">
                                Save Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}