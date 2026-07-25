import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { CalendarCheck, Sparkles, Calendar as CalendarIcon, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const PlannerPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Study Planner</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            AI-powered study plans organized around your goals and schedule
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" leftIcon={<CalendarIcon className="h-4 w-4" />}>
            Calendar View
          </Button>
          <Button variant="primary" leftIcon={<Sparkles className="h-4 w-4" />}>
            AI Generate Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card hoverable>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Active Plans</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">0</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hoverable>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tasks Completed</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">0</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hoverable>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600 dark:bg-secondary-950/40 dark:text-secondary-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Scheduled Hours</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">0h</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle>Upcoming Study Schedule</CardTitle>
          <CardDescription>Your personalized study plan for the next 7 days</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <EmptyState
            icon={<CalendarCheck className="h-8 w-8" />}
            title="No study plans yet"
            description="Let AI create a personalized study schedule based on your goals, subjects, and available time."
            action={{ label: 'Generate Study Plan', onClick: () => {}, variant: 'primary', icon: <Sparkles className="h-4 w-4" /> }}
            secondaryAction={{ label: 'Create Manually', onClick: () => {} }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
