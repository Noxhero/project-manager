import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useAppSelector } from "../../app/hooks";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Bonjour ! Je suis votre assistant IA pour la gestion de projets. Comment puis-je vous aider aujourd'hui ?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { items: projects } = useAppSelector((s) => s.projects);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Basic response patterns
    if (lowerMessage.includes("bonjour") || lowerMessage.includes("salut")) {
      return "Bonjour ! Comment puis-je vous aider avec vos projets aujourd'hui ?";
    }
    
    if (lowerMessage.includes("projet") && lowerMessage.includes("créer")) {
      return "Pour créer un nouveau projet, cliquez sur le bouton 'Créer un projet' dans le dashboard. Vous pourrez y ajouter une description, des objectifs, des tags et une deadline.";
    }
    
    if (lowerMessage.includes("tâche") && lowerMessage.includes("créer")) {
      return "Vous pouvez créer des tâches directement depuis la page de détail d'un projet en cliquant sur '+ Tâche', ou utiliser la vue Kanban pour un aperçu visuel et glisser-déposer vos tâches.";
    }
    
    if (lowerMessage.includes("kanban")) {
      return "Le tableau Kanban vous permet de visualiser vos tâches en trois colonnes : À faire, En cours, Terminé. Vous pouvez glisser-déposer les tâches entre les colonnes pour mettre à jour leur statut.";
    }
    
    if (lowerMessage.includes("statistique") || lowerMessage.includes("progression")) {
      const totalTasks = projects.reduce((acc, p) => acc + 0, 0); // TODO: get real task count
      return `Vous avez actuellement ${projects.length} projet(s) actif(s). Le dashboard vous montre une progression moyenne basée sur vos tâches complétées.`;
    }
    
    if (lowerMessage.includes("aide") || lowerMessage.includes("help")) {
      return `Je peux vous aider avec :
      • Création et gestion de projets
      • Organisation des tâches (Kanban)
      • Suivi de la progression
      • Recommandations d'architecture
      • Connexions entre projets
      
      Essayez de me demander comment créer un projet ou organiser vos tâches !`;
    }
    
    // Default response with project context
    if (projects.length > 0) {
      const projectNames = projects.slice(0, 3).map(p => p.name).join(", ");
      return `Je vois que vous travaillez sur ${projects.length} projet(s) comme "${projectNames}". Pour aller plus loin, je vous recommande de bien définir les objectifs de chaque projet et d'utiliser le Kanban pour suivre les tâches. Y a-t-il quelque chose de spécifique sur lequel vous aimeriez de l'aide ?`;
    }
    
    return "Je suis là pour vous aider dans la gestion de vos projets ! Vous pouvez me poser des questions sur la création de projets, l'organisation des tâches, le suivi de progression, ou demander des recommandations. Que souhaitez-vous savoir ?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    try {
      const botResponse = await generateResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 500);
    } catch (error) {
      toast.error("Erreur lors de la génération de la réponse");
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-lg shadow-blue-500/25"
        >
          {isOpen ? "✕" : "🤖"}
        </Button>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]"
          >
            <Card className="h-[500px] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-sm">🤖</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-50">Assistant IA</div>
                    <div className="text-xs text-slate-400">En ligne</div>
                  </div>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  className="h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        message.sender === "user"
                          ? "bg-blue-500/20 text-blue-100 ml-auto"
                          : "bg-white/10 text-slate-100"
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/10 rounded-2xl px-4 py-2">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" />
                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-white/10 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez votre message..."
                    className="flex-1 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="px-3"
                  >
                    →
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
