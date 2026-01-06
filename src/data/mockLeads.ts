import { Lead } from '@/types/lead';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Ahmed Khan',
    company: 'TechCorp Solutions',
    platform: 'whatsapp',
    assignedTo: 'salesperson1',
    status: 'new',
    lastActionDate: today,
    nextFollowUpDate: tomorrow,
    screenshots: [],
    notes: [{ id: '1', text: 'Client interested in premium package', createdAt: today }],
    createdAt: today,
  },
  {
    id: '2',
    name: 'Sara Ali',
    company: 'Digital Marketing Hub',
    platform: 'instagram',
    assignedTo: 'salesperson1',
    status: 'replied',
    lastActionDate: yesterday,
    nextFollowUpDate: today,
    screenshots: [],
    notes: [{ id: '2', text: 'Kal follow-up karna hai', createdAt: yesterday }],
    createdAt: twoDaysAgo,
  },
  {
    id: '3',
    name: 'Bilal Hussain',
    company: 'E-Commerce Pro',
    platform: 'linkedin',
    assignedTo: 'salesperson1',
    status: 'interested',
    lastActionDate: twoDaysAgo,
    nextFollowUpDate: yesterday,
    screenshots: [],
    notes: [{ id: '3', text: 'Client ne budget bola - 50k', createdAt: twoDaysAgo }],
    createdAt: twoDaysAgo,
  },
  {
    id: '4',
    name: 'Fatima Zahra',
    company: 'Fashion Studio',
    platform: 'email',
    assignedTo: 'salesperson1',
    status: 'seen',
    lastActionDate: today,
    nextFollowUpDate: nextWeek,
    screenshots: [],
    notes: [],
    createdAt: yesterday,
  },
  {
    id: '5',
    name: 'Usman Tariq',
    company: 'Real Estate Group',
    platform: 'whatsapp',
    assignedTo: 'salesperson1',
    status: 'closed',
    lastActionDate: yesterday,
    nextFollowUpDate: yesterday,
    screenshots: [],
    notes: [{ id: '4', text: 'Deal closed! Payment received', createdAt: yesterday }],
    createdAt: twoDaysAgo,
  },
  {
    id: '6',
    name: 'Ayesha Malik',
    company: 'Health & Wellness Co',
    platform: 'instagram',
    assignedTo: 'salesperson1',
    status: 'lost',
    lastActionDate: twoDaysAgo,
    nextFollowUpDate: twoDaysAgo,
    screenshots: [],
    notes: [{ id: '5', text: 'Budget issue - went with competitor', createdAt: twoDaysAgo }],
    createdAt: twoDaysAgo,
  },
  {
    id: '7',
    name: 'Hassan Raza',
    company: 'Startup Labs',
    platform: 'linkedin',
    assignedTo: 'salesperson1',
    status: 'new',
    lastActionDate: today,
    nextFollowUpDate: tomorrow,
    screenshots: [],
    notes: [],
    createdAt: today,
  },
];
