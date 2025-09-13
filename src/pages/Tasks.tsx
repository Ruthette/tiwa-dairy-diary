
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Plus, Search, Filter, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTasks } from '@/hooks/useTasks';
import { useAnimals } from '@/hooks/useAnimals';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import PageHeader from '@/components/PageHeader';
import { Tables } from '@/integrations/supabase/types';


type Task = Tables<'tasks'>;

const Tasks = () => {
  const { t } = useLanguage();
  const { data: tasks = [], isLoading, error } = useTasks();
  const { data: animals = [] } = useAnimals();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [animalFilter, setAnimalFilter] = useState('all');
  

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter && priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (animalFilter && animalFilter !== 'all') {
      filtered = filtered.filter(task => task.animal_id === animalFilter);
    }

    return filtered;
  }, [tasks, searchTerm, statusFilter, priorityFilter, animalFilter]);

  const taskStats = useMemo(() => {
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const completed = tasks.filter(t => t.status === 'Done').length;
    const overdue = tasks.filter(t => {
      const dueDate = new Date(t.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return t.status === 'Pending' && dueDate < today;
    }).length;

    return { pending, completed, overdue, total: tasks.length };
  }, [tasks]);

  const handleAddTask = () => {
    console.log('Add Task button clicked - opening form');
    setEditingTask(undefined);
    setFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    console.log('Edit Task clicked for:', task.id);
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    console.log('Closing task form');
    setFormOpen(false);
    setEditingTask(undefined);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setAnimalFilter('all');
  };

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 pb-20">
  //       <div className="p-4 max-w-6xl mx-auto">
  //         <Card>
  //           <CardContent className="p-12 text-center">
  //             <div className="text-red-600 mb-4">⚠️ Error loading tasks</div>
  //             <p className="text-gray-600 mb-4">Please try refreshing the page</p>
  //             <Button onClick={() => window.location.reload()}>
  //               Refresh Page
  //             </Button>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 space-y-4 max-w-6xl mx-auto">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
              ✅ {t('tasks')}
            </h1>
            <p className="text-gray-600 text-sm mt-1">Manage your farm tasks and reminders</p>
          </div>
          <Button 
            onClick={handleAddTask} 
            className="bg-purple-600 hover:bg-purple-700" 
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1 md:mr-2" />
            Add Task
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-gray-600">{t('loading')}</div>
            </div>
          </div>
        )}

        {/* Task Summary - Only show when not loading */}
        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3 md:p-4 text-center">
                <div className="text-lg md:text-2xl font-bold text-blue-600">{taskStats.pending}</div>
                <div className="text-xs md:text-sm text-blue-700">Pending</div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-3 md:p-4 text-center">
                <div className="text-lg md:text-2xl font-bold text-green-600">{taskStats.completed}</div>
                <div className="text-xs md:text-sm text-green-700">Completed</div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-3 md:p-4 text-center">
                <div className="text-lg md:text-2xl font-bold text-red-600">{taskStats.overdue}</div>
                <div className="text-xs md:text-sm text-red-700">Overdue</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-3 md:p-4 text-center">
                <div className="text-lg md:text-2xl font-bold text-gray-600">{taskStats.total}</div>
                <div className="text-xs md:text-sm text-gray-700">Total</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters - Only show when not loading */}
        {!isLoading && (
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Done">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={animalFilter} onValueChange={setAnimalFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Cows" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cows</SelectItem>
                    {animals.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.name} {animal.tag && `(${animal.tag})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={clearFilters} size="sm">
                  <Filter className="h-4 w-4 mr-1 md:mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks List - Show when not loading */}
        {!isLoading && (
          <>
            {filteredTasks.length > 0 ? (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 md:p-12 text-center">
                  <Calendar className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">
                    {tasks.length === 0 ? 'You haven\'t added any tasks yet' : 'No tasks found'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    {tasks.length === 0 
                      ? 'Start by adding your first farm task to stay organized.'
                      : 'Try adjusting your filters to find the tasks you\'re looking for.'
                    }
                  </p>
                  {tasks.length === 0 && (
                    <Button onClick={handleAddTask} className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Task
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Task Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
            <TaskForm
              task={editingTask}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
