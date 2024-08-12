'use client'

import AndroidIcon from '@mui/icons-material/Android';
import CheckIcon from '@mui/icons-material/Check';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Rating, Select, Stack, Switch, TextField, Toolbar, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// Chat Buddy Name

const defaultChatBuddyName = 'AI Chat Bot';

export default function Home() {
    // const { data: session, status } = useSession();
    // const router = useRouter();

    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi! My name is ' + defaultChatBuddyName + ' and I am an AI powered assistant. I can communicate in over 100 languages. How can I help you today?',
        },
    ]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [chatBuddyName, setChatBuddyName] = useState(defaultChatBuddyName);
    const [darkMode, setDarkMode] = useState(true);
    const [themeColor, setThemeColor] = useState('blue');
    const [sentMessageColor, setSentMessageColor] = useState('#1a75ff');
    const [receivedMessageColor, setReceivedMessageColor] = useState('cornflowerblue');

    const colorMappings = {
        'pink': { sentMessageColor: 'hotpink', receivedMessageColor: '#ff99dd' },
        'red': { sentMessageColor: '#f44336', receivedMessageColor: '#e57373' },
        'orange': { sentMessageColor: '#ff7733', receivedMessageColor: '#ffaa80' },
        'yellow': { sentMessageColor: '#cca300', receivedMessageColor: '#e6b800' },
        'green': { sentMessageColor: '#4caf50', receivedMessageColor: '#81c784' },
        'blue': { sentMessageColor: '#1a75ff', receivedMessageColor: 'cornflowerblue' },
        'purple': { sentMessageColor: '#9c27b0', receivedMessageColor: '#ba68c8' },
    };

    const sendMessage = async () => {
        if (!message.trim()) return;  // Don't send empty messages
        setIsLoading(true);

        setMessage('');
        setMessages((messages) => [
            ...messages,
            { role: 'user', content: message },
            { role: 'assistant', content: '' },
        ]);

        // Check if the message is 'language list' and handle it
        if (message.toLowerCase() === 'language list') {
            setIsLoading(false);
            setMessages((messages) => [
                ...messages.slice(0, messages.length - 1), // Remove the empty assistant message
                { role: 'assistant', content: sendLanguageList() },
            ]);
            return;
        }

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([...messages, { role: 'user', content: message }]),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value, { stream: true });
                setMessages((messages) => {
                    let lastMessage = messages[messages.length - 1];
                    let otherMessages = messages.slice(0, messages.length - 1);
                    return [
                        ...otherMessages,
                        { ...lastMessage, content: lastMessage.content + text },
                    ];
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages((messages) => [
                ...messages,
                { role: 'assistant', content: 'I am sorry, but I encountered an error. Please try again later.'},
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Add this function in your component
    const resetChat = () => {
        setMessages([
            { role: 'assistant', content: 'Hi! My name is ' + defaultChatBuddyName + ' and I am an AI powered assistant. I can communicate in over 100 languages. How can I help you today?' },
        ]);
    };

  // Function to return the language list
  function sendLanguageList() {
    return 'Here is an overview of the languages I support, although I will not be able to account for every single dialect and minor language: 1. Afrikaans 2. Albanian 3. Amharic 4. Arabic 5. Armenian 6. Azerbaijani 7. Basque 8. Belarusian 9. Bengali 10. Bosnian 11. Bulgarian 12. Catalan 13. Cebuano 14. Chichewa 15. Chinese (Simplified) 16. Chinese (Traditional) 17. Corsican 18. Croatian 19. Czech 20. Danish 21. Dutch 22. English 23. Esperanto 24. Estonian 25. Filipino (Tagalog) 26. Finnish 27. French 28. Frisian 29. Galician 30. Georgian 31. German 32. Greek 33. Gujarati 34. Haitian Creole 35. Hausa 36. Hawaiian 37. Hebrew 38. Hindi 39. Hmong 40. Hungarian 41. Icelandic 42. Igbo 43. Indonesian 44. Irish 45. Italian 46. Japanese 47. Javanese 48. Kannada 49. Kazakh 50. Khmer 51. Kinyarwanda 52. Korean 53. Kurdish (Kurmanji) 54. Kyrgyz 55. Lao 56. Latin 57. Latvian 58. Lithuanian 59. Luxembourgish 60. Macedonian 61. Malagasy 62. Malay 63. Malayalam 64. Maltese 65. Maori 66. Marathi 67. Mongolian 68. Myanmar (Burmese) 69. Nepali 70. Norwegian 71. Odia (Oriya) 72. Pashto 73. Persian 74. Polish 75. Portuguese 76. Punjabi 77. Romanian 78. Russian 79. Samoan 80. Scots Gaelic 81. Serbian 82. Sesotho 83. Shona 84. Sindhi 85. Sinhala 86. Slovak 87. Slovenian 88. Somali 89. Spanish 90. Sundanese 91. Swahili 92. Swedish 93. Tajik 94. Tamil 95. Tatar 96. Telugu 97. Thai 98. Turkish 99. Turkmen 100. Ukrainian 101. Urdu 102. Uyghur 103. Uzbek 104. Vietnamese 105. Welsh 106. Xhosa 107. Yiddish 108. Yoruba 109. Zulu This list encompasses many languages from around the world. Should you need assistance in a specific language not listed here, feel free to ask!';
  }

  // AutoScrolling
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // Settings

  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  // Theme Color
  const handleThemeChange = (event) => {
    const newThemeColor = event.target.value;
    setThemeColor(newThemeColor);

    const { sentMessageColor, receivedMessageColor } = colorMappings[newThemeColor] || {};
    setSentMessageColor(sentMessageColor);
    setReceivedMessageColor(receivedMessageColor);
  };

  // Dark Mode
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  
  // Add new state variable
  const [pendingChatBuddyName, setPendingChatBuddyName] = useState(chatBuddyName);

  // Update pendingChatBuddyName instead of chatBuddyName
  const handleChatBuddyNameChange = (event) => {
    setPendingChatBuddyName(event.target.value);
  };

  // New function to confirm name change
  const handleChatBuddyNameConfirm = () => {
    setChatBuddyName(pendingChatBuddyName);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'assistant',
        content: 'Hi! My name is ' + pendingChatBuddyName + ' and I am an AI powered assistant. I can communicate in over 100 languages. How can I help you today?',
      },
    ]);
  };

  // Feedback State
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(0);

   useEffect(() => {
    const timer = setTimeout(() => {
      setFeedbackOpen(true);
    }, 30000);

    return () => clearTimeout(timer); // Clear timer on component unmount
  }, []);

  const handleFeedbackSubmit = () => {
    setFeedbackOpen(false);
  };

  return (
    <Box
      width='100vw'
      height='100vh'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      bgcolor={darkMode ? 'black' : 'white'}
    >
      <Stack
        direction={'column'}
        width='100%'
        height='100%'
        border='1px solid white'
        borderRadius='10px'
        p={2}
        spacing={3}
      >
        <AppBar position='static' style={{ backgroundColor: sentMessageColor }}>
          <Toolbar>
            <Tooltip title='Reset Chat'>
              <Button onClick={resetChat} style={{ color: sentMessageColor, backgroundColor: 'white' , padding: 5}}>Reset Chat</Button>
            </Tooltip>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1, textAlign: 'center', fontSize: '25px' }}>
              {chatBuddyName}
            </Typography>
            <Tooltip title='Settings'>
              <IconButton edge='start' color='inherit' aria-label='settings' onClick={handleSettingsClick} sx ={{marginRight: '2%'}}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Logout'>
            <Link href='/'>
              <IconButton color='inherit' sx={{ marginRight: '1%' }}>
                <AndroidIcon />
              </IconButton>
            </Link>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow='auto'
          maxHeight='100%'
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display='flex'
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? receivedMessageColor
                    : sentMessageColor
                }
                color='white'
                borderRadius={10}
                p={2}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            InputLabelProps={{
              shrink: true,
              style: { color: darkMode ? 'white' : 'black' },
            }}
            InputProps={{
              style: {
                color: darkMode ? 'white' : 'black'
              },
            }}
            label='Type message...'
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Tooltip title='Send Message'>
            <Button variant='contained' onClick={sendMessage} disabled={isLoading} style={{ color: 'white', backgroundColor: sentMessageColor }}>
              {isLoading ? 'Sending..' : 'Send'}
            </Button>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Settings Modal */}
      <Dialog open={settingsOpen} onClose={handleCloseSettings}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ marginTop: '3%' }}>

            <FormControl fullWidth>
              <Box display='flex' alignItems='center'>
                <Typography>Dark Mode</Typography>
                <Switch checked={darkMode} onChange={handleDarkModeToggle} />
              </Box>
            </FormControl>

            <Box display='flex' alignItems='center'>
              <TextField
                label='Chat Buddy Name'
                fullWidth
                value={pendingChatBuddyName}
                onChange={handleChatBuddyNameChange}
              />

              <IconButton onClick={handleChatBuddyNameConfirm}>
                <CheckIcon />
              </IconButton>
            </Box>

            <FormControl fullWidth>
              <InputLabel id='theme-label'>Theme Color</InputLabel>
              <Select
                labelId='theme-label'
                value={themeColor}
                label='Theme Color'
                onChange={handleThemeChange}
              >
                <MenuItem value='pink'>Pink</MenuItem>
                <MenuItem value='red'>Red</MenuItem>
                <MenuItem value='orange'>Orange</MenuItem>
                <MenuItem value='yellow'>Yellow</MenuItem>
                <MenuItem value='green'>Green</MenuItem>
                <MenuItem value='blue'>Blue</MenuItem>
                <MenuItem value='purple'>Purple</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                label='Language'
              >
                <MenuItem>Message 'Language List' to see what languages I can speak in.</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={feedbackOpen}>
        <DialogTitle>Rate Your Chat Experience</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>How would you rate your experience?</Typography>
            <Rating
              name='rating'
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFeedbackSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
