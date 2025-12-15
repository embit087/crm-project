"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  PhoneIcon,
  XIcon,
  SearchIcon,
  UsersIcon,
  HashIcon,
  ClockIcon,
  CheckIcon,
  PlusIcon,
  FileTextIcon,
  ChevronDownIcon,
} from "@/components/icons";
import type { Person } from "@/types";

// Country data with dial codes
const COUNTRIES = [
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳" },
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", dialCode: "+52", flag: "🇲🇽" },
  { name: "Spain", code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "Netherlands", code: "NL", dialCode: "+31", flag: "🇳🇱" },
  { name: "South Korea", code: "KR", dialCode: "+82", flag: "🇰🇷" },
  { name: "Singapore", code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { name: "Hong Kong", code: "HK", dialCode: "+852", flag: "🇭🇰" },
  { name: "Taiwan", code: "TW", dialCode: "+886", flag: "🇹🇼" },
  { name: "Switzerland", code: "CH", dialCode: "+41", flag: "🇨🇭" },
  { name: "Sweden", code: "SE", dialCode: "+46", flag: "🇸🇪" },
  { name: "Norway", code: "NO", dialCode: "+47", flag: "🇳🇴" },
  { name: "Denmark", code: "DK", dialCode: "+45", flag: "🇩🇰" },
  { name: "Finland", code: "FI", dialCode: "+358", flag: "🇫🇮" },
  { name: "Ireland", code: "IE", dialCode: "+353", flag: "🇮🇪" },
  { name: "New Zealand", code: "NZ", dialCode: "+64", flag: "🇳🇿" },
  { name: "South Africa", code: "ZA", dialCode: "+27", flag: "🇿🇦" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { name: "Israel", code: "IL", dialCode: "+972", flag: "🇮🇱" },
  { name: "Russia", code: "RU", dialCode: "+7", flag: "🇷🇺" },
  { name: "Poland", code: "PL", dialCode: "+48", flag: "🇵🇱" },
  { name: "Portugal", code: "PT", dialCode: "+351", flag: "🇵🇹" },
  { name: "Belgium", code: "BE", dialCode: "+32", flag: "🇧🇪" },
  { name: "Austria", code: "AT", dialCode: "+43", flag: "🇦🇹" },
  { name: "Greece", code: "GR", dialCode: "+30", flag: "🇬🇷" },
  { name: "Turkey", code: "TR", dialCode: "+90", flag: "🇹🇷" },
  { name: "Thailand", code: "TH", dialCode: "+66", flag: "🇹🇭" },
  { name: "Vietnam", code: "VN", dialCode: "+84", flag: "🇻🇳" },
  { name: "Philippines", code: "PH", dialCode: "+63", flag: "🇵🇭" },
  { name: "Indonesia", code: "ID", dialCode: "+62", flag: "🇮🇩" },
  { name: "Malaysia", code: "MY", dialCode: "+60", flag: "🇲🇾" },
  { name: "Argentina", code: "AR", dialCode: "+54", flag: "🇦🇷" },
  { name: "Chile", code: "CL", dialCode: "+56", flag: "🇨🇱" },
  { name: "Colombia", code: "CO", dialCode: "+57", flag: "🇨🇴" },
  { name: "Peru", code: "PE", dialCode: "+51", flag: "🇵🇪" },
  { name: "Egypt", code: "EG", dialCode: "+20", flag: "🇪🇬" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966", flag: "🇸🇦" },
  { name: "Pakistan", code: "PK", dialCode: "+92", flag: "🇵🇰" },
  { name: "Bangladesh", code: "BD", dialCode: "+880", flag: "🇧🇩" },
  { name: "Nigeria", code: "NG", dialCode: "+234", flag: "🇳🇬" },
  { name: "Kenya", code: "KE", dialCode: "+254", flag: "🇰🇪" },
];

// Custom icons for call panel
const MicIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const MicOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const PhoneOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
    <line x1="23" y1="1" x2="1" y2="23" />
  </svg>
);

const BackspaceIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
    <line x1="18" y1="9" x2="12" y2="15" />
    <line x1="12" y1="9" x2="18" y2="15" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
    <path d="M19 11l.5 1.5L21 13l-1.5.5-.5 1.5-.5-1.5L17 13l1.5-.5.5-1.5z" />
  </svg>
);

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

type CallTab = "dialpad" | "contacts" | "recent";
type CallState = "idle" | "dialing" | "ringing" | "connected" | "ended";

interface CallPanelProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Person[];
  onSelectContact?: (contact: Person) => void;
  initialPhoneNumber?: string;
}

interface CallNote {
  id: string;
  text: string;
  timestamp: string;
}

interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TranscriptLine {
  id: string;
  speaker: "agent" | "contact";
  text: string;
  timestamp: string;
}

interface CallHistoryItem {
  id: string;
  contactName: string;
  contactCompany: string;
  phoneNumber: string;
  duration: string;
  date: string;
  direction: "inbound" | "outbound";
  transcript: TranscriptLine[];
  notes: CallNote[];
  audioUrl?: string;
}

// Mock call history data
const mockCallHistory: CallHistoryItem[] = [
  {
    id: "call-1",
    contactName: "Brian Chesky",
    contactCompany: "Airbnb",
    phoneNumber: "+1 123456789",
    duration: "05:32",
    date: "Today, 2:30 PM",
    direction: "outbound",
    transcript: [
      { id: "t1", speaker: "agent", text: "Hello Brian, this is regarding the partnership proposal.", timestamp: "00:05" },
      { id: "t2", speaker: "contact", text: "Yes, I've reviewed it. Let's discuss the details.", timestamp: "00:12" },
      { id: "t3", speaker: "agent", text: "Great! The main points are integration timeline and revenue sharing.", timestamp: "00:20" },
    ],
    notes: [
      { id: "n1", text: "Interested in Q1 launch", timestamp: "01:15" },
      { id: "n2", text: "Wants 70/30 split", timestamp: "03:22" },
    ],
    audioUrl: "#",
  },
  {
    id: "call-2",
    contactName: "Dario Amodei",
    contactCompany: "Anthropic",
    phoneNumber: "+1 555123456",
    duration: "12:45",
    date: "Yesterday, 4:15 PM",
    direction: "inbound",
    transcript: [
      { id: "t1", speaker: "contact", text: "Hi, I wanted to follow up on our AI integration discussion.", timestamp: "00:03" },
      { id: "t2", speaker: "agent", text: "Of course! We've made progress on the API design.", timestamp: "00:10" },
    ],
    notes: [
      { id: "n1", text: "API rate limits discussed", timestamp: "02:30" },
    ],
    audioUrl: "#",
  },
];

export function CallPanel({ isOpen, onClose, contacts, initialPhoneNumber }: CallPanelProps) {
  const [activeTab, setActiveTab] = useState<CallTab>("dialpad");
  const [dialNumber, setDialNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [callState, setCallState] = useState<CallState>("idle");
  const [currentContact, setCurrentContact] = useState<Person | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [notes, setNotes] = useState<CallNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [showTranscript, setShowTranscript] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Person | null>(null);
  
  // Call history modal state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCallHistory, setSelectedCallHistory] = useState<CallHistoryItem | null>(null);
  const [historyModalTab, setHistoryModalTab] = useState<"transcript" | "notes" | "audio">("transcript");
  const [historyModalPosition, setHistoryModalPosition] = useState({ x: 100, y: 100 });
  const historyModalDragging = useRef(false);
  const historyModalDragOffset = useRef({ x: 0, y: 0 });

  // Panel dragging state
  const [panelPosition, setPanelPosition] = useState<{ x: number; y: number } | null>(null);
  const panelDragging = useRef(false);
  const panelDragOffset = useRef({ x: 0, y: 0 });

  // Panel resize state
  const [panelSize, setPanelSize] = useState<{ width: number; height: number } | null>(null);
  const panelResizing = useRef(false);
  const resizeStartPos = useRef({ x: 0, y: 0 });
  const resizeStartSize = useRef({ width: 0, height: 0 });

  // Country code selector state
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const noteInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRIES;
    const search = countrySearch.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.code.toLowerCase().includes(search) ||
        c.dialCode.includes(search)
    );
  }, [countrySearch]);

  // Filter contacts based on search
  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phones.includes(searchQuery) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Click outside to close panel
  useEffect(() => {
    if (!isOpen || callState !== "idle") return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // Check if click is on the FAB button
        const target = e.target as HTMLElement;
        if (target.closest(".call-fab")) return;
        // Check if click is on history modal
        if (target.closest(".call-history-modal")) return;
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, callState]);

  // Click outside to close country dropdown
  useEffect(() => {
    if (!showCountryDropdown) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
        setCountrySearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCountryDropdown]);

  // History modal dragging
  useEffect(() => {
    if (!showHistoryModal) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!historyModalDragging.current) return;
      setHistoryModalPosition({
        x: e.clientX - historyModalDragOffset.current.x,
        y: e.clientY - historyModalDragOffset.current.y,
      });
    };

    const handleMouseUp = () => {
      historyModalDragging.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [showHistoryModal]);

  // Panel dragging
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelDragging.current) return;
      const newX = e.clientX - panelDragOffset.current.x;
      const newY = e.clientY - panelDragOffset.current.y;
      // Constrain to viewport
      const maxX = window.innerWidth - 280;
      const maxY = window.innerHeight - 100;
      setPanelPosition({
        x: Math.max(0, Math.min(maxX, newX)),
        y: Math.max(0, Math.min(maxY, newY)),
      });
    };

    const handleMouseUp = () => {
      panelDragging.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isOpen]);

  const startPanelDrag = (e: React.MouseEvent) => {
    // Don't drag if clicking on close button
    if ((e.target as HTMLElement).closest(".call-panel-close")) return;
    
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) {
      panelDragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      panelDragging.current = true;
      // Initialize position if not set
      if (!panelPosition) {
        setPanelPosition({ x: rect.left, y: rect.top });
      }
    }
  };

  // Panel resizing
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelResizing.current) return;
      
      const deltaX = e.clientX - resizeStartPos.current.x;
      const deltaY = e.clientY - resizeStartPos.current.y;
      
      const minWidth = 280;
      const minHeight = 250;
      const maxWidth = 600;
      const maxHeight = 800;
      
      const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartSize.current.width + deltaX));
      const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartSize.current.height + deltaY));
      
      setPanelSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      panelResizing.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isOpen]);

  const startPanelResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) {
      // Always use the actual current size from the DOM
      const currentWidth = panelSize?.width || rect.width;
      const currentHeight = panelSize?.height || rect.height;
      
      resizeStartPos.current = {
        x: e.clientX,
        y: e.clientY,
      };
      resizeStartSize.current = {
        width: currentWidth,
        height: currentHeight,
      };
      
      // Initialize panelSize if not set to ensure smooth resizing
      if (!panelSize) {
        setPanelSize({ width: currentWidth, height: currentHeight });
      }
      
      panelResizing.current = true;
    }
  };

  const startHistoryModalDrag = useCallback((e: React.MouseEvent) => {
    historyModalDragging.current = true;
    historyModalDragOffset.current = {
      x: e.clientX - historyModalPosition.x,
      y: e.clientY - historyModalPosition.y,
    };
  }, [historyModalPosition]);

  // Simulate transcript updates during call
  useEffect(() => {
    if (callState === "connected") {
      const transcriptSimulation = [
        { delay: 2000, speaker: "agent" as const, text: "Hello, this is regarding your account inquiry." },
        { delay: 5000, speaker: "contact" as const, text: "Yes, I was wondering about the pricing update." },
        { delay: 8000, speaker: "agent" as const, text: "Of course, let me pull up that information for you." },
        { delay: 12000, speaker: "contact" as const, text: "I'm specifically interested in the enterprise plan." },
        { delay: 15000, speaker: "agent" as const, text: "The enterprise plan includes advanced analytics and priority support." },
      ];

      const timeouts: NodeJS.Timeout[] = [];
      transcriptSimulation.forEach(({ delay, speaker, text }) => {
        const timeout = setTimeout(() => {
          const newLine: TranscriptLine = {
            id: `t-${Date.now()}`,
            speaker,
            text,
            timestamp: formatDuration(Math.floor(delay / 1000)),
          };
          setTranscript((prev) => [...prev, newLine]);
        }, delay);
        timeouts.push(timeout);
      });

      const actionTimeout = setTimeout(() => {
        setActionItems([
          { id: "ai-1", text: "Send enterprise pricing documentation", completed: false },
          { id: "ai-2", text: "Schedule follow-up demo for analytics features", completed: false },
          { id: "ai-3", text: "Add to enterprise pipeline", completed: false },
        ]);
      }, 10000);
      timeouts.push(actionTimeout);

      return () => timeouts.forEach(clearTimeout);
    }
  }, [callState]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // Call timer
  useEffect(() => {
    if (callState === "connected") {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callState]);

  // Set initial phone number when panel opens
  useEffect(() => {
    if (isOpen && initialPhoneNumber && callState === "idle") {
      setDialNumber(initialPhoneNumber);
      setActiveTab("dialpad");
    }
  }, [isOpen, initialPhoneNumber, callState]);

  // Reset state when panel closes
  useEffect(() => {
    if (!isOpen) {
      if (callState === "idle" || callState === "ended") {
        // Use setTimeout to avoid synchronous setState calls in effect
        setTimeout(() => {
          setDialNumber("");
          setSearchQuery("");
          setActiveTab("dialpad");
          setSelectedContact(null);
        }, 0);
      }
    }
  }, [isOpen, callState]);

  const selectContactForCall = useCallback((contact: Person) => {
    setSelectedContact(contact);
    setDialNumber(contact.phones || "");
    setActiveTab("dialpad");
  }, []);

  const clearSelectedContact = useCallback(() => {
    setSelectedContact(null);
    setDialNumber("");
  }, []);

  const handleDial = useCallback((digit: string) => {
    setDialNumber((prev) => prev + digit);
  }, []);

  const handleBackspace = useCallback(() => {
    setDialNumber((prev) => prev.slice(0, -1));
  }, []);

  const initiateCall = useCallback((number: string, contact?: Person) => {
    if (!number) return;
    setCurrentContact(contact || null);
    setCallState("dialing");
    setCallDuration(0);
    setTranscript([]);
    setActionItems([]);
    setNotes([]);

    setTimeout(() => setCallState("ringing"), 1000);
    setTimeout(() => setCallState("connected"), 3000);
  }, []);

  const endCall = useCallback(() => {
    setCallState("ended");
    setTimeout(() => {
      setCallState("idle");
      setCurrentContact(null);
      setDialNumber("");
      setIsMuted(false);
      setIsOnHold(false);
    }, 2000);
  }, []);

  const addNote = useCallback(() => {
    if (!newNote.trim()) return;
    const note: CallNote = {
      id: `note-${Date.now()}`,
      text: newNote.trim(),
      timestamp: formatDuration(callDuration),
    };
    setNotes((prev) => [...prev, note]);
    setNewNote("");
    noteInputRef.current?.focus();
  }, [newNote, callDuration]);

  const toggleActionItem = useCallback((id: string) => {
    setActionItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

  const openCallHistoryModal = (call: CallHistoryItem) => {
    setSelectedCallHistory(call);
    setHistoryModalTab("transcript");
    setShowHistoryModal(true);
  };

  // History Modal - memoized to avoid recreating on every render
  const HistoryModal = useMemo(() => {
    if (!showHistoryModal || !selectedCallHistory) return null;
    
    return (
      <div
        className="call-history-modal"
        style={{ left: historyModalPosition.x, top: historyModalPosition.y }}
      >
        <div className="call-history-modal-header" onMouseDown={startHistoryModalDrag}>
          <div className="call-history-modal-title">
            <span>{selectedCallHistory.contactName}</span>
            <span className="call-history-modal-subtitle">{selectedCallHistory.date}</span>
          </div>
          <button className="call-history-modal-close" onClick={() => setShowHistoryModal(false)}>
            <XIcon />
          </button>
        </div>
        
        <div className="call-history-modal-tabs">
          <button
            className={`call-history-tab ${historyModalTab === "transcript" ? "active" : ""}`}
            onClick={() => setHistoryModalTab("transcript")}
          >
            <MicIcon /> Transcript
          </button>
          <button
            className={`call-history-tab ${historyModalTab === "notes" ? "active" : ""}`}
            onClick={() => setHistoryModalTab("notes")}
          >
            <FileTextIcon /> Notes
          </button>
          <button
            className={`call-history-tab ${historyModalTab === "audio" ? "active" : ""}`}
            onClick={() => setHistoryModalTab("audio")}
          >
            <PlayIcon /> Audio
          </button>
        </div>

        <div className="call-history-modal-content">
          {historyModalTab === "transcript" && (
            <div className="call-history-transcript">
              {selectedCallHistory.transcript.map((line) => (
                <div key={line.id} className={`history-transcript-line ${line.speaker}`}>
                  <span className="history-transcript-speaker">
                    {line.speaker === "agent" ? "You" : selectedCallHistory.contactName}
                  </span>
                  <span className="history-transcript-text">{line.text}</span>
                  <span className="history-transcript-time">{line.timestamp}</span>
                </div>
              ))}
            </div>
          )}
          
          {historyModalTab === "notes" && (
            <div className="call-history-notes">
              {selectedCallHistory.notes.length === 0 ? (
                <div className="call-history-empty">No notes for this call</div>
              ) : (
                selectedCallHistory.notes.map((note) => (
                  <div key={note.id} className="history-note-item">
                    <span className="history-note-time">{note.timestamp}</span>
                    <span className="history-note-text">{note.text}</span>
                  </div>
                ))
              )}
            </div>
          )}
          
          {historyModalTab === "audio" && (
            <div className="call-history-audio">
              <div className="audio-player">
                <button className="audio-play-btn">
                  <PlayIcon />
                </button>
                <div className="audio-waveform">
                  <div className="audio-progress" style={{ width: "35%" }} />
                </div>
                <span className="audio-duration">{selectedCallHistory.duration}</span>
              </div>
              <div className="audio-info">
                <span>Recording from {selectedCallHistory.date}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, [showHistoryModal, selectedCallHistory, historyModalPosition, historyModalTab, startHistoryModalDrag]);

  if (!isOpen) return null;

  // Active call view
  if (callState !== "idle") {
    return (
      <>
        <div 
          className="call-panel call-panel-active call-panel-compact animate-slide-in-right" 
          ref={panelRef}
          style={panelPosition ? { 
            position: 'fixed', 
            left: panelPosition.x, 
            top: panelPosition.y,
            right: 'auto',
            bottom: 'auto'
          } : undefined}
        >
          <div className="call-panel-header call-panel-header-draggable" onMouseDown={startPanelDrag}>
            <div className="call-panel-header-info">
              <div className="call-contact-avatar-sm">
                {currentContact?.name.charAt(0) || dialNumber.charAt(0) || "?"}
              </div>
              <div className="call-contact-details">
                <span className="call-contact-name">{currentContact?.name || dialNumber}</span>
                <span className="call-contact-company">{currentContact?.company || "Unknown"}</span>
              </div>
            </div>
            <div className="call-status-badge" data-state={callState}>
              {callState === "dialing" && "Dialing..."}
              {callState === "ringing" && "Ringing..."}
              {callState === "connected" && (
                <>
                  <span className="call-status-dot" />
                  {formatDuration(callDuration)}
                </>
              )}
              {callState === "ended" && "Call Ended"}
            </div>
          </div>

          <div className="call-controls">
            <button
              className={`call-control-btn ${isMuted ? "active" : ""}`}
              onClick={() => setIsMuted(!isMuted)}
              disabled={callState !== "connected"}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
              <span>Mute</span>
            </button>
            <button
              className={`call-control-btn ${isOnHold ? "active" : ""}`}
              onClick={() => setIsOnHold(!isOnHold)}
              disabled={callState !== "connected"}
            >
              <PauseIcon />
              <span>Hold</span>
            </button>
            <button className="call-control-btn call-end-btn" onClick={endCall}>
              <PhoneOffIcon />
              <span>End</span>
            </button>
          </div>

          {callState === "connected" && (
            <div className="call-content">
              <div className="call-content-tabs">
                <button
                  className={`call-content-tab ${showTranscript ? "active" : ""}`}
                  onClick={() => setShowTranscript(true)}
                >
                  <MicIcon />
                  Transcript
                </button>
                <button
                  className={`call-content-tab ${!showTranscript ? "active" : ""}`}
                  onClick={() => setShowTranscript(false)}
                >
                  <FileTextIcon />
                  Notes ({notes.length})
                </button>
              </div>

              {showTranscript ? (
                <div className="call-transcript" ref={transcriptRef}>
                  {transcript.length === 0 ? (
                    <div className="call-transcript-empty">
                      <MicIcon />
                      <span>Listening...</span>
                    </div>
                  ) : (
                    transcript.map((line) => (
                      <div key={line.id} className={`transcript-line ${line.speaker}`}>
                        <span className="transcript-speaker">
                          {line.speaker === "agent" ? "You" : currentContact?.name || "Contact"}
                        </span>
                        <span className="transcript-text">{line.text}</span>
                        <span className="transcript-time">{line.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="call-notes">
                  <div className="call-notes-list">
                    {notes.map((note) => (
                      <div key={note.id} className="call-note-item">
                        <span className="call-note-time">{note.timestamp}</span>
                        <span className="call-note-text">{note.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="call-note-input-container">
                    <input
                      ref={noteInputRef}
                      type="text"
                      className="call-note-input"
                      placeholder="Add note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addNote()}
                    />
                    <button className="call-note-add-btn" onClick={addNote} disabled={!newNote.trim()}>
                      <PlusIcon />
                    </button>
                  </div>
                </div>
              )}

              {actionItems.length > 0 && (
                <div className="call-action-items">
                  <div className="call-action-header">
                    <SparklesIcon />
                    <span>Actions</span>
                  </div>
                  <div className="call-action-list">
                    {actionItems.map((item) => (
                      <button
                        key={item.id}
                        className={`call-action-item ${item.completed ? "completed" : ""}`}
                        onClick={() => toggleActionItem(item.id)}
                      >
                        <div className={`call-action-checkbox ${item.completed ? "checked" : ""}`}>
                          {item.completed && <CheckIcon />}
                        </div>
                        <span>{item.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {HistoryModal}
      </>
    );
  }

  // Idle state - Dialpad/Contacts view
  return (
    <>
      <div 
        className="call-panel call-panel-compact animate-slide-in-right" 
        ref={panelRef}
        style={{
          ...(panelPosition ? { 
            position: 'fixed', 
            left: panelPosition.x, 
            top: panelPosition.y,
            right: 'auto',
            bottom: 'auto'
          } : {}),
          ...(panelSize ? {
            width: `${panelSize.width}px`,
            height: `${panelSize.height}px`,
          } : {})
        }}
      >
        <div className="call-panel-header call-panel-header-draggable" onMouseDown={startPanelDrag}>
          <span className="call-panel-title">Call</span>
          <button className="call-panel-close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="call-panel-tabs">
          <button
            className={`call-tab ${activeTab === "dialpad" ? "active" : ""}`}
            onClick={() => setActiveTab("dialpad")}
          >
            <HashIcon />
            Dial
          </button>
          <button
            className={`call-tab ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => setActiveTab("contacts")}
          >
            <UsersIcon />
            Contacts
          </button>
          <button
            className={`call-tab ${activeTab === "recent" ? "active" : ""}`}
            onClick={() => setActiveTab("recent")}
          >
            <ClockIcon />
            History
          </button>
        </div>

        <div className="call-panel-content">
          {activeTab === "dialpad" && (
            <div className="call-dialpad-view">
              {selectedContact && (
                <div className="call-selected-contact">
                  <div className="call-contact-avatar-sm">{selectedContact.name.charAt(0)}</div>
                  <div className="call-contact-info">
                    <span className="call-contact-name">{selectedContact.name}</span>
                    <span className="call-contact-phone">{selectedContact.company}</span>
                  </div>
                  <button className="call-clear-contact" onClick={clearSelectedContact}>
                    <XIcon />
                  </button>
                </div>
              )}

              <div className="call-number-display">
                <div className="country-code-selector" ref={countryDropdownRef}>
                  <button 
                    className="country-code-trigger"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  >
                    <span className="country-flag">{selectedCountry.flag}</span>
                    <span className="country-dial-code">{selectedCountry.dialCode}</span>
                    <ChevronDownIcon />
                  </button>
                  
                  {showCountryDropdown && (
                    <div className="country-dropdown">
                      <div className="country-search-container">
                        <SearchIcon />
                        <input
                          type="text"
                          className="country-search-input"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="country-list">
                        {filteredCountries.map((country) => (
                          <button
                            key={country.code}
                            className={`country-option ${selectedCountry.code === country.code ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedCountry(country);
                              setShowCountryDropdown(false);
                              setCountrySearch("");
                            }}
                          >
                            <span className="country-flag">{country.flag}</span>
                            <span className="country-name">{country.name}</span>
                            <span className="country-dial-code">{country.dialCode}</span>
                          </button>
                        ))}
                        {filteredCountries.length === 0 && (
                          <div className="country-no-results">No countries found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  className="call-number-input"
                  value={dialNumber}
                  onChange={(e) => {
                    setDialNumber(e.target.value.replace(/[^\d+*#]/g, ""));
                    if (selectedContact) setSelectedContact(null);
                  }}
                  onKeyDown={(e) => {
                    // Allow standard keyboard shortcuts (Cmd/Ctrl + A, C, X, Z, Y)
                    // Note: Cmd+V is handled by onPaste to filter content
                    if (e.metaKey || e.ctrlKey) {
                      const key = e.key.toLowerCase();
                      if (['a', 'c', 'x', 'z', 'y'].includes(key)) {
                        return; // Allow default browser behavior
                      }
                      // Prevent default for Cmd+V, let onPaste handle it
                      if (key === 'v') {
                        return; // onPaste will handle it
                      }
                    }
                    // Allow arrow keys, home, end, delete, backspace
                    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Delete', 'Backspace'].includes(e.key)) {
                      return; // Allow default browser behavior
                    }
                    // Allow Tab and Escape
                    if (['Tab', 'Escape'].includes(e.key)) {
                      return;
                    }
                  }}
                  onPaste={(e) => {
                    // Allow paste, but filter the content
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text');
                    const filtered = pastedText.replace(/[^\d+*#]/g, "");
                    if (filtered) {
                      setDialNumber(filtered);
                      if (selectedContact) setSelectedContact(null);
                    }
                  }}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="Enter number"
                />
                {dialNumber && (
                  <button className="call-backspace" onClick={handleBackspace}>
                    <BackspaceIcon />
                  </button>
                )}
              </div>

              <div className="call-dialpad-grid">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((digit) => (
                  <button key={digit} className="dialpad-key" onClick={() => handleDial(digit)}>
                    <span className="dialpad-digit">{digit}</span>
                    {digit !== "*" && digit !== "#" && (
                      <span className="dialpad-letters">
                        {digit === "0" ? "+" : digit === "1" ? "" : ["ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"][parseInt(digit) - 2]}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <button
                className="call-dial-btn"
                onClick={() => initiateCall(dialNumber, selectedContact || undefined)}
                disabled={!dialNumber}
              >
                <PhoneIcon />
                <span>Call{selectedContact ? ` ${selectedContact.name}` : ""}</span>
              </button>
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="call-contacts-view">
              <div className="call-search">
                <SearchIcon />
                <input
                  type="text"
                  className="call-search-input"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="call-contact-list">
                {filteredContacts.length === 0 ? (
                  <div className="call-contacts-empty">
                    <UsersIcon />
                    <span>No contacts</span>
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <button key={contact.id} className="call-contact-item" onClick={() => selectContactForCall(contact)}>
                      <div className="call-contact-avatar-sm">{contact.name.charAt(0)}</div>
                      <div className="call-contact-info">
                        <span className="call-contact-name">{contact.name}</span>
                        <span className="call-contact-phone">{contact.phones || "No phone"}</span>
                      </div>
                      <span className="call-contact-company-tag">{contact.company}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "recent" && (
            <div className="call-recent-view">
              {mockCallHistory.length === 0 ? (
                <div className="call-recent-empty">
                  <ClockIcon />
                  <span>No recent calls</span>
                </div>
              ) : (
                <div className="call-history-list">
                  {mockCallHistory.map((call) => (
                    <button key={call.id} className="call-history-item" onClick={() => openCallHistoryModal(call)}>
                      <div className="call-history-item-avatar">{call.contactName.charAt(0)}</div>
                      <div className="call-history-item-info">
                        <span className="call-history-item-name">{call.contactName}</span>
                        <span className="call-history-item-meta">
                          {call.direction === "outbound" ? "↗" : "↙"} {call.date} · {call.duration}
                        </span>
                      </div>
                      <HistoryIcon />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="call-panel-resize-handle" onMouseDown={startPanelResize} />
      </div>
      {HistoryModal}
    </>
  );
}
