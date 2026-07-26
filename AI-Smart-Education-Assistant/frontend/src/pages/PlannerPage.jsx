import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CalendarCheck,
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  Target,
  Plus,
  CheckCircle2,
  Circle,
  MoreVertical,
  Trash2,
  Edit2,
  LayoutDashboard,
  ListTodo,
  CalendarDays,
  X,
  AlertTriangle,
  History
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { plannerService } from "@/services";

export const PlannerPage = () => {
  const [planner, setPlanner] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard"); // dashboard, timeline, calendar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchPlanner();
  }, []);

  const fetchPlanner = async () => {
    try {
      setLoading(true);
      const res = await plannerService.list();
      if (res?.data && res.data.length > 0) {
        setPlanner(res.data[0]);
        setTasks(res.data[0].study_schedule || []);
      } else {
        // Create an initial planner if none exists
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const newPlanner = await plannerService.create({
          exam_date: nextMonth.toISOString(),
          daily_hours: 2,
          study_schedule: []
        });
        if (newPlanner?.data) {
          setPlanner(newPlanner.data);
          setTasks([]);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load planner data");
    } finally {
      setLoading(false);
    }
  };

  const saveTasksToBackend = async (updatedTasks) => {
    const plannerId = planner?._id || planner?.id;
    if (!plannerId) return;
    try {
      await plannerService.update(plannerId, { study_schedule: updatedTasks });
      setPlanner({ ...planner, study_schedule: updatedTasks });
      setTasks(updatedTasks);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes");
    }
  };

  const handleSaveTask = async (taskData) => {
    let updatedTasks = [...tasks];
    if (editingTask) {
      updatedTasks = updatedTasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t);
      toast.success("Task updated successfully");
    } else {
      updatedTasks.push({
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        createdAt: new Date().toISOString(),
        ...taskData
      });
      toast.success("Task created successfully");
    }
    await saveTasksToBackend(updatedTasks);
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (id) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    await saveTasksToBackend(updatedTasks);
    toast.success("Task deleted");
  };

  const handleToggleTask = async (id) => {
    const updatedTasks = tasks.map(t => 
      t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
    );
    await saveTasksToBackend(updatedTasks);
    toast.success("Task status updated");
  };

  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    
    // safe date check
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysTasks = tasks.filter(t => t.date && t.date.split('T')[0] === todayStr);
    
    const scheduledHours = tasks.reduce((acc, t) => acc + (parseInt(t.duration) || 60), 0) / 60;
    
    return {
      completed,
      pending,
      total: tasks.length,
      todaysCount: todaysTasks.length,
      scheduledHours: scheduledHours.toFixed(1),
      progress: tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100)
    };
  }, [tasks]);

  const TaskModal = () => {
    if (!isModalOpen) return null;
    const [formData, setFormData] = useState(editingTask || {
      title: '', subject: '', priority: 'Medium', date: new Date().toISOString().split('T')[0], time: '10:00', duration: '60'
    });

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-lg">{editingTask ? 'Edit Task' : 'Create Task'}</h3>
            <button onClick={() => { setIsModalOpen(false); setEditingTask(null); }} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" className="w-full rounded-lg border p-2 bg-transparent dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Read Chapter 5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input type="text" className="w-full rounded-lg border p-2 bg-transparent dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g. Physics" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select className="w-full rounded-lg border p-2 bg-transparent dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" className="w-full rounded-lg border p-2 bg-transparent dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input type="time" className="w-full rounded-lg border p-2 bg-transparent dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <Button variant="outline" onClick={() => { setIsModalOpen(false); setEditingTask(null); }}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSaveTask(formData)} disabled={!formData.title}>Save Task</Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Today's Tasks</CardTitle>
              <CardDescription>Stay on top of your daily goals</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {tasks.filter(t => t.date && t.date.split('T')[0] === new Date().toISOString().split('T')[0]).length === 0 ? (
              <EmptyState
                icon={<Target className="h-8 w-8" />}
                title="No tasks for today"
                description="Enjoy your day off or get ahead by adding some tasks."
                action={{ label: "Add Task", onClick: () => setIsModalOpen(true), variant: "primary", icon: <Plus className="h-4 w-4" /> }}
              />
            ) : (
              <div className="space-y-3">
                {tasks.filter(t => t.date && t.date.split('T')[0] === new Date().toISOString().split('T')[0]).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleToggleTask(task.id)} className="text-primary-600 hover:text-primary-700">
                        {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 text-slate-400" />}
                      </button>
                      <div>
                        <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>{task.title}</h4>
                        <p className="text-xs text-slate-500">{task.subject} • {task.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                        task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>{task.priority}</span>
                      <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors">
                        <Edit2 className="w-4 h-4 text-slate-500" />
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="overflow-hidden h-full">
          <CardHeader>
            <CardTitle>Study Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 relative">
            {/* Background glowing effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary-500/10 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 shadow-inner"
                 style={{ background: `conic-gradient(#3b82f6 ${stats.progress}%, transparent 0)` }}>
              <div className="absolute inset-2 bg-white dark:bg-slate-950 rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-500">{stats.progress}%</span>
              </div>
            </div>
            <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">{stats.completed} of {stats.total} tasks completed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <Card>
      <CardHeader>
        <CardTitle>All Tasks (Timeline)</CardTitle>
        <CardDescription>View your upcoming and past tasks across all days</CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <EmptyState title="No tasks yet" description="Start organizing your study plan." />
        ) : (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-12 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent pt-4">
            {tasks.sort((a,b) => new Date(a.date) - new Date(b.date)).map((task, idx) => (
              <div key={task.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8`}>
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-slate-950 bg-primary-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mx-auto">
                  {task.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3 h-3 fill-current" />}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-semibold text-sm ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>{task.title}</h4>
                    <span className="text-xs font-medium text-primary-500">{task.date ? new Date(task.date).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : ''}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{task.subject} • {task.time}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggleTask(task.id)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${task.status === 'completed' ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                      {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
                    </button>
                    <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"><Edit2 className="w-3.5 h-3.5 text-slate-500" /></button>
                    <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderCalendar = () => {
    // Generate next 7 days for the calendar view
    const days = Array.from({length: 7}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Calendar</CardTitle>
          <CardDescription>Your tasks mapped out for the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {days.map(dayStr => {
              const dayTasks = tasks.filter(t => t.date && t.date.split('T')[0] === dayStr);
              const dateObj = new Date(dayStr);
              const isToday = dayStr === new Date().toISOString().split('T')[0];
              return (
                <div key={dayStr} className={`flex flex-col border rounded-xl p-3 h-full min-h-[160px] ${isToday ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 shadow-sm' : 'border-slate-200 dark:border-slate-800'}`}>
                  <div className="flex flex-col mb-3">
                    <span className={`text-sm font-bold ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {dateObj.toLocaleDateString(undefined, {weekday: 'short'})}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {dateObj.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                    </span>
                  </div>
                  <div className="space-y-2 flex-1">
                    {dayTasks.length === 0 ? (
                      <p className="text-xs text-slate-400 italic mt-2">No tasks scheduled</p>
                    ) : dayTasks.map(task => (
                      <div key={task.id} onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="cursor-pointer group relative bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary-300 transition-all text-left">
                        <div className={`text-xs font-semibold truncate ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {task.title}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                          <span>{task.time}</span>
                          <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Study Planner</h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Organize your tasks, deadlines, and daily schedule effortlessly.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
          <Button variant={view === "dashboard" ? "primary" : "ghost"} size="sm" onClick={() => setView("dashboard")} leftIcon={<LayoutDashboard className="h-4 w-4" />}>Dashboard</Button>
          <Button variant={view === "timeline" ? "primary" : "ghost"} size="sm" onClick={() => setView("timeline")} leftIcon={<ListTodo className="h-4 w-4" />}>Timeline</Button>
          <Button variant={view === "calendar" ? "primary" : "ghost"} size="sm" onClick={() => setView("calendar")} leftIcon={<CalendarDays className="h-4 w-4" />}>Calendar</Button>
          <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>
          <Button variant="primary" size="sm" onClick={() => { setEditingTask(null); setIsModalOpen(true); }} leftIcon={<Plus className="h-4 w-4" />}>New Task</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="border-t-4 border-t-primary-500 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Active Tasks</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.pending}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-t-4 border-t-accent-500 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Tasks Completed</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.completed}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-secondary-500 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Scheduled Hours</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.scheduledHours}h</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm animate-pulse">Loading your study plans...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {view === "dashboard" && renderDashboard()}
            {view === "timeline" && renderTimeline()}
            {view === "calendar" && renderCalendar()}
          </motion.div>
        </AnimatePresence>
      )}

      <TaskModal />
    </motion.div>
  );
};
