import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { 
  Timer, 
  Code, 
  Play, 
  Save, 
  AlertTriangle, 
  Lock,
  CheckCircle,
  FileText
} from 'lucide-react';

const Exam = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [studentName] = useState(localStorage.getItem('studentName') || '');
  const [studentRoll] = useState(localStorage.getItem('studentRoll') || '');

  const languages = [
    { value: 'python', label: 'Python', template: '# Write your Python code here\nprint("Hello World")' },
    { value: 'cpp', label: 'C++', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}' },
    { value: 'c', label: 'C', template: '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}' },
    { value: 'java', label: 'Java', template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}' },
    { value: 'javascript', label: 'JavaScript', template: '// Write your JavaScript code here\nconsole.log("Hello World");' },
    { value: 'html', label: 'HTML', template: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Page Title</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>' }
  ];

  const questions = [
    {
      id: 1,
      title: "Array Sum Problem",
      description: "Write a function to find the sum of all elements in an array.",
      difficulty: "Easy",
      points: 10
    },
    {
      id: 2,
      title: "Palindrome Checker",
      description: "Create a function that checks if a given string is a palindrome.",
      difficulty: "Medium",
      points: 15
    },
    {
      id: 3,
      title: "Binary Search Implementation",
      description: "Implement binary search algorithm for a sorted array.",
      difficulty: "Hard",
      points: 20
    }
  ];

  useEffect(() => {
    // Check if user is authenticated
    if (!studentName || !studentRoll) {
      navigate('/login');
      return;
    }

    // Enable fullscreen and lock
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
        setIsLocked(true);
      } catch (error) {
        console.error('Fullscreen failed:', error);
      }
    };

    enterFullscreen();

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Prevent tab switching and other cheating attempts
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast({
          title: "Warning!",
          description: "Tab switching detected. This action has been logged.",
          variant: "destructive",
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, etc.
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        toast({
          title: "Action Blocked",
          description: "Developer tools are disabled during the exam.",
          variant: "destructive",
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [studentName, studentRoll, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    const template = languages.find(lang => lang.value === value)?.template || '';
    setCode(template);
  };

  const handleRunCode = () => {
    toast({
      title: "Code Executed",
      description: "Your code has been compiled and executed successfully.",
    });
  };

  const handleSaveProgress = () => {
    // Save to localStorage for persistence
    localStorage.setItem(`exam_progress_${studentRoll}`, JSON.stringify({
      currentQuestion,
      code,
      selectedLanguage,
      timeLeft
    }));
    
    toast({
      title: "Progress Saved",
      description: "Your work has been automatically saved.",
    });
  };

  const handleSubmitExam = () => {
    // Calculate mock results
    const mockScore = Math.floor(Math.random() * 45) + 55; // 55-100
    const mockSpeed = Math.floor(Math.random() * 50) + 50; // 50-100
    const mockEfficiency = Math.floor(Math.random() * 40) + 60; // 60-100
    
    localStorage.setItem('examResults', JSON.stringify({
      studentName,
      studentRoll,
      score: mockScore,
      speed: mockSpeed,
      efficiency: mockEfficiency,
      completedAt: new Date().toISOString()
    }));

    navigate('/analysis');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-500';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'Hard': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between glass-card p-4">
        <div className="flex items-center gap-4">
          <Lock className="h-6 w-6 text-destructive" />
          <div>
            <h1 className="font-bold text-lg">CodeLab Examination</h1>
            <p className="text-sm text-muted-foreground">
              {studentName} • {studentRoll}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-destructive" />
            <span className="font-mono text-lg font-bold text-destructive">
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <Button onClick={handleSaveProgress} variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          
          <Button onClick={handleSubmitExam} className="neon-button">
            Submit Exam
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 h-[calc(100vh-120px)]">
        {/* Question Panel */}
        <div className="space-y-4">
          {/* Question Navigation */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Questions</CardTitle>
                <Badge variant="secondary">
                  {currentQuestion + 1} of {questions.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {questions.map((_, index) => (
                  <Button
                    key={index}
                    variant={currentQuestion === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentQuestion(index)}
                    className="w-12 h-12"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Question */}
          <Card className="glass-card flex-1">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {questions[currentQuestion].title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getDifficultyColor(questions[currentQuestion].difficulty)}>
                      {questions[currentQuestion].difficulty}
                    </Badge>
                    <Badge variant="secondary">
                      {questions[currentQuestion].points} points
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {questions[currentQuestion].description}
              </p>
              
              <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold mb-2">Sample Input:</h4>
                <code className="text-sm font-mono">arr = [1, 2, 3, 4, 5]</code>
                
                <h4 className="font-semibold mb-2 mt-4">Expected Output:</h4>
                <code className="text-sm font-mono">15</code>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Editor Panel */}
        <div className="space-y-4">
          {/* Language Selector */}
          <Card className="glass-card">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <Code className="h-5 w-5 text-primary" />
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button onClick={handleRunCode} variant="outline" className="ml-auto">
                  <Play className="h-4 w-4 mr-2" />
                  Run Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Code Editor */}
          <Card className="glass-card flex-1">
            <CardContent className="p-0 h-full">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-full min-h-[400px] resize-none font-mono text-sm code-editor border-0 rounded-t-none"
                placeholder="Write your code here..."
              />
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-background/50 p-3 rounded font-mono text-sm min-h-[80px]">
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  Compilation successful
                </div>
                <div className="mt-2 text-muted-foreground">
                  Output will appear here when you run your code...
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Warning Message */}
      {isLocked && (
        <div className="fixed bottom-4 right-4">
          <Card className="glass-card border-destructive/20">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4" />
                Exam mode active - Screen locked
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Exam;