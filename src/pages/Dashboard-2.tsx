import React, { useState, useMemo } from 'react';
import { DollarSign, Home, ClipboardList, Settings, Calendar, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// --- In-file UI Components to replace external libraries ---
const Card = ({ children, className = "" }) => <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>{children}</div>;
const CardHeader = ({ children }) => <div className="mb-4">{children}</div>;
const CardTitle = ({ children, className = "" }) => <h2 className={`text-xl font-bold text-gray-800 ${className}`}>{children}</h2>;
const CardContent = ({ children, className = "" }) => <div className={`${className}`}>{children}</div>;
const Button = ({ children, onClick, className = "" }) => <button className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${className}`} onClick={onClick}>{children}</button>;
const Label = ({ children, htmlFor, className = "" }) => <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>{children}</label>;
const Input = ({ type = "text", value, onChange, placeholder, className = "", id }) => <input type={type} id={id} value={value} onChange={onChange} placeholder={placeholder} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 ${className}`} />;

// Simplified Select and SelectItem components to fix DOM nesting errors
const Select = ({ children, onValueChange, value, className = "" }) => (
  <select onChange={e => onValueChange(e.target.value)} value={value} className={`block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm ${className}`}>
    {children}
  </select>
);
const SelectItem = ({ children, value }) => <option value={value}>{children}</option>;

const Checkbox = ({ checked, disabled, onChange }) => <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="rounded text-green-600" />;
// --- End of in-file UI Components ---

// In-file component for the DPI Report Chart.
const DPIReportChart = ({ score }) => {
  const normalizedScore = Number(score);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 10) * circumference;

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        <circle
          className={`
            transition-all duration-700
            ${normalizedScore >= 7 ? 'text-green-500' : normalizedScore >= 4 ? 'text-yellow-500' : 'text-red-500'}
          `}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={isNaN(strokeDashoffset) ? circumference : strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <span className="text-3xl font-bold">
          {isNaN(normalizedScore) ? 'N/A' : normalizedScore.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

// In-file TaskCard and TaskForm components
const TaskCard = ({ task, onEdit }) => (
  <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
    <div className={`flex-1 ${task.status === 'Done' ? 'line-through text-gray-500' : ''}`}>
      {task.title}
    </div>
    <Button onClick={() => onEdit(task)}>Edit</Button>
  </div>
);

const TaskForm = ({ task, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 className="text-xl font-bold mb-4">{task ? 'Edit Task' : 'Add Task'}</h2>
      <Input
        placeholder="Task Title"
        defaultValue={task?.title || ''}
        className="mb-4"
      />
      <Button onClick={onClose}>Close</Button>
    </div>
  </div>
);

const Dashboard2 = () => {
  // Use a placeholder for the language hook since it's not provided.
  const t = (text) => text;
  // Use dummy data for tasks and animals since hooks are not provided.
  const tasks = [
    { id: '1', title: 'Vaccinate cow #123', status: 'In Progress' },
    { id: '2', title: 'Feed cow #456', status: 'Done' },
    { id: '3', title: 'Check milk production', status: 'In Progress' },
    { id: '4', title: 'Clean milking equipment', status: 'In Progress' },
    { id: '5', title: 'Check on new calf', status: 'In Progress' },
    { id: '6', title: 'Fix broken fence', status: 'In Progress' },
  ];
  const refetchTasks = () => console.log("Refetching tasks...");
  const animals = [];

  // State for task form modal
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // State for filters
  const [timeFilter, setTimeFilter] = useState('Week');
  const [categoryFilter, setCategoryFilter] = useState('vaccine');

  // State for new task input
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date().toISOString().slice(0, 10));

  // Hardcoded short tasks for the new list
  const [shortTasks, setShortTasks] = useState([
    { id: 'st1', title: 'Feed hay', completed: false },
    { id: 'st2', title: 'Water cows', completed: true },
    { id: 'st3', title: 'Milk cows', completed: false },
  ]);

  // Financial tracking state
  const [transactionType, setTransactionType] = useState('Cost');
  const [transactionCategory, setTransactionCategory] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');

  const costCategories = ['Vaccine', 'Feed', 'Labour', 'Animal Bought'];
  const incomeCategories = ['Milk Sale', 'Animal Sale', 'Manure Sale'];

  // Filtered tasks based on category filter
  const filteredTasks = tasks.filter(task => {
    if (!categoryFilter) return true;
    return task.title.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  // DPI Report State and Logic
  const [milkSales, setMilkSales] = useState(10000);
  const [totalCosts, setTotalCosts] = useState(8000);

  const scoreMetrics = useMemo(() => {
    if (totalCosts === 0) {
      return { dpi: 0, normalizedScore: 0 };
    }
    const dpi = (milkSales - totalCosts) / totalCosts;
    const normalizedScore = Math.min(10, Math.max(0, 5 * dpi));
    return { dpi, normalizedScore };
  }, [milkSales, totalCosts]);

  const { normalizedScore } = scoreMetrics;

  const handleInputChange = (e, setter) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setter(value);
    }
  };

  const handleShortTaskToggle = (id) => {
    setShortTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const chartData = useMemo(() => {
    return [
      { name: 'Jan', income: 8000, expenses: 4000 },
      { name: 'Feb', income: 10000, expenses: 5000 },
      { name: 'Mar', income: 9500, expenses: 4800 },
      { name: 'Apr', income: 11000, expenses: 5500 },
    ];
  }, []);

  // State and data for milk production filter
  const [milkTimeFilter, setMilkTimeFilter] = useState('1month');

  const milkData = useMemo(() => {
    const data = {
      'week': [
        { name: 'Mon', milk: 1000 },
        { name: 'Tue', milk: 1100 },
        { name: 'Wed', milk: 1050 },
        { name: 'Thu', milk: 1200 },
        { name: 'Fri', milk: 1150 },
        { name: 'Sat', milk: 1300 },
        { name: 'Sun', milk: 1250 },
      ],
      '1month': [
        { name: 'Week 1', milk: 3000 },
        { name: 'Week 2', milk: 3500 },
        { name: 'Week 3', milk: 3200 },
        { name: 'Week 4', milk: 4000 },
      ],
      '1yr': [
        { name: 'Q1', milk: 9500 },
        { name: 'Q2', milk: 10500 },
        { name: 'Q3', milk: 11000 },
        { name: 'Q4', milk: 10800 },
      ],
      '3yr': [
        { name: '2022', milk: 40000 },
        { name: '2023', milk: 42000 },
        { name: '2024', milk: 44000 },
      ],
    };
    return data[milkTimeFilter] || data['1month'];
  }, [milkTimeFilter]);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleTaskFormClose = () => {
    setShowTaskForm(false);
    setNewTaskTitle('');
    refetchTasks();
  };

  const handleAddTransaction = () => {
    // Logic to add a new transaction
    console.log("Adding transaction:", { transactionType, transactionCategory, transactionAmount });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 p-4 max-w-md mx-auto">
      {/* DPI Report Section */}
      <Card className="shadow-lg mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            DPI Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 flex flex-col items-center justify-center">
            <DPIReportChart score={normalizedScore} />
            <p className="mt-4 text-center text-lg text-gray-600">
              Your Normalized Score is <span className="font-bold">{normalizedScore.toFixed(1)}</span>
            </p>
          </div>
          
          <div className="flex-1 w-full mt-8 md:mt-0 space-y-2">
            <h3 className="font-semibold text-center mb-2">Daily Tasks</h3>
            {/* Real code to get from Firestore Records */}
            {/*
              const [dailyTasks, setDailyTasks] = useState([]);
              useEffect(() => {
                if (!db || !userId) return;
                const tasksRef = collection(db, `/artifacts/${appId}/users/${userId}/dailyTasks`);
                const q = query(tasksRef, where("date", "==", new Date().toISOString().slice(0, 10)));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                  const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                  setDailyTasks(tasks);
                });
                return () => unsubscribe();
              }, [db, userId, appId]);
            */}
            {shortTasks.map(task => (
              <div key={task.id} className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
                <Checkbox 
                  checked={task.completed} 
                  onChange={() => handleShortTaskToggle(task.id)} 
                />
                <Label>{task.title}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg mb-4">
        <CardHeader>
          <CardTitle>Calculate Your Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="milk-sales" className="text-gray-700">
              Milk Sales ($)
            </Label>
            <Input
              id="milk-sales"
              type="number"
              value={milkSales}
              onChange={(e) => handleInputChange(e, setMilkSales)}
            />
          </div>
          <div>
            <Label htmlFor="total-costs" className="text-gray-700">
              Total Costs ($)
            </Label>
            <Input
              id="total-costs"
              type="number"
              value={totalCosts}
              onChange={(e) => handleInputChange(e, setTotalCosts)}
            />
          </div>
        </CardContent>
      </Card>
      {/* End of DPI Report Section */}

      {/* Financial Graphs */}
      <Card className="mb-4">
        <CardContent className="p-0">
          <h3 className="text-center font-semibold mb-4 pt-4">Monthly Income vs. Expenses</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#10B981" />
              <Bar dataKey="expenses" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between items-center px-6 pt-4">
            <h3 className="font-semibold text-gray-800">Milk Production Trajectory (Liters)</h3>
            <div className="relative">
              <Select onValueChange={setMilkTimeFilter} value={milkTimeFilter}>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="1month">Month</SelectItem>
                <SelectItem value="1yr">1 Year</SelectItem>
                <SelectItem value="3yr">3 Years</SelectItem>
              </Select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={milkData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="milk" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Add Task Section */}
      <Card className="shadow-lg mb-4">
        <CardHeader>
          <CardTitle>Add Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="task-title" className="text-gray-700">
              Task Title
            </Label>
            <Input
              id="task-title"
              placeholder="Add task/reminder here."
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="task-due-date" className="text-gray-700">
              Due Date
            </Label>
            <Input
              id="task-due-date"
              type="date"
              value={newTaskDueDate}
              onChange={e => setNewTaskDueDate(e.target.value)}
            />
          </div>
          <Button onClick={handleAddTask} className="w-full bg-green-600 hover:bg-green-700">Add Task</Button>
        </CardContent>
      </Card>

      {/* Add Transaction Section */}
      <Card className="shadow-lg mb-4">
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="transaction-type">Type</Label>
            <Select onValueChange={setTransactionType} value={transactionType}>
              <SelectItem value="Cost">Cost</SelectItem>
              <SelectItem value="Income">Income</SelectItem>
            </Select>
          </div>
          <div>
            <Label htmlFor="transaction-category">Category</Label>
            <Select onValueChange={setTransactionCategory} value={transactionCategory}>
              <SelectItem value="">Select a category</SelectItem>
              {transactionType === 'Cost' ? (
                costCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)
              ) : (
                incomeCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)
              )}
            </Select>
          </div>
          <div>
            <Label htmlFor="transaction-amount">Amount ($)</Label>
            <Input
              id="transaction-amount"
              type="number"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
            />
          </div>
          <Button onClick={handleAddTransaction} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="inline-block mr-2" size={16} />
            Add Transaction
          </Button>
        </CardContent>
      </Card>

      {/* Task list with icons and update button */}
      <div className="space-y-4 mb-4">
        {filteredTasks.slice(0, 5).map(task => (
          <TaskCard key={task.id} task={task} onEdit={(task) => {
            setEditingTask(task);
            setShowTaskForm(true);
          }} />
        ))}
        {filteredTasks.length > 5 && (
          <Button onClick={() => console.log("Navigate to tasks page")} className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300">
            More
          </Button>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
        <Button className="flex flex-col items-center gap-1 bg-green-700 text-white">
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Button>
        <Button className="flex flex-col items-center gap-1">
          {/* Using an emoji for the cow icon as Lucide does not have one */}
          <span className="text-2xl">🐄</span>
          <span>Cows</span>
        </Button>
        <Button className="flex flex-col items-center gap-1">
          <ClipboardList className="h-5 w-5" />
          <span>Records</span>
        </Button>
        <Button className="flex flex-col items-center gap-1">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Button>
      </div>

      {/* Task form modal */}
      {showTaskForm && (
        <TaskForm task={editingTask} onClose={handleTaskFormClose} />
      )}
    </div>
  );
};

export default Dashboard2;
