import { db as realDb } from './config';
import * as firestore from 'firebase/firestore';

// Check if we should use mock database
const isMock = !import.meta.env.VITE_FIREBASE_API_KEY || 
               import.meta.env.VITE_FIREBASE_API_KEY.includes("DummyKey") ||
               import.meta.env.VITE_FIREBASE_PROJECT_ID === "your-app-id";

if (isMock) {
  console.log("Firestore: Firebase config is not provided or using dummy keys. Falling back to LocalStorage Database.");
}

// Initial seed data if localStorage is empty
const seedData = {
  books: [
    {
      id: 'book-1',
      serialNumber: 'REL-0001',
      category: '200 - Religion',
      subCategory: 'Islamic History',
      language: 'English',
      title: 'The Sealed Nectar (Ar-Raheeq Al-Makhtum)',
      author: 'Safiur Rahman Al-Mubarakpuri',
      publisher: 'Darussalam Publications',
      quantity: 5,
      available: true,
      imageURL: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'book-2',
      serialNumber: 'LIT-0001',
      category: '800 - Literature',
      subCategory: 'Fiction',
      language: 'English',
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      publisher: 'HarperOne',
      quantity: 3,
      available: true,
      imageURL: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'book-3',
      serialNumber: 'MOT-0001',
      category: 'Motivation',
      subCategory: 'Self-Help',
      language: 'English',
      title: 'Atomic Habits',
      author: 'James Clear',
      publisher: 'Avery',
      quantity: 2,
      available: false,
      borrowedBy: 'Nihal PM',
      borrowDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      imageURL: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  members: [
    {
      id: 'mem-1',
      name: 'Nihal PM',
      email: 'nihal@example.com',
      phone: '9876543210',
      serialNumber: 'MEM-0001',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'mem-2',
      name: 'Amal Raj',
      email: 'amal@example.com',
      phone: '8765432109',
      serialNumber: 'MEM-0002',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

const initMockStorage = () => {
  if (!localStorage.getItem('mock_books')) {
    localStorage.setItem('mock_books', JSON.stringify(seedData.books));
  }
  if (!localStorage.getItem('mock_members')) {
    localStorage.setItem('mock_members', JSON.stringify(seedData.members));
  }
};

if (isMock) {
  initMockStorage();
}

const getMockStorage = (collectionName) => {
  const data = localStorage.getItem(`mock_${collectionName}`);
  return data ? JSON.parse(data) : [];
};

const setMockStorage = (collectionName, data) => {
  localStorage.setItem(`mock_${collectionName}`, JSON.stringify(data));
};

// Exports matching Firebase Firestore SDK API
export const db = isMock ? { type: 'mockDb' } : realDb;

export const collection = (database, name) => {
  if (isMock) {
    return { type: 'collection', name };
  }
  return firestore.collection(database, name);
};

export const doc = (database, collectionNameOrPath, id) => {
  if (isMock) {
    const colName = typeof collectionNameOrPath === 'string' 
      ? collectionNameOrPath 
      : collectionNameOrPath.name;
    return { type: 'doc', collectionName: colName, id };
  }
  return firestore.doc(database, collectionNameOrPath, id);
};

export const query = (colRef, ...constraints) => {
  if (isMock) {
    return { type: 'query', collectionName: colRef.name, constraints };
  }
  return firestore.query(colRef, ...constraints);
};

export const where = (field, op, value) => {
  if (isMock) {
    return { type: 'where', field, op, value };
  }
  return firestore.where(field, op, value);
};

export const orderBy = (field, direction = 'asc') => {
  if (isMock) {
    return { type: 'orderBy', field, direction };
  }
  return firestore.orderBy(field, direction);
};

export const limit = (n) => {
  if (isMock) {
    return { type: 'limit', n };
  }
  return firestore.limit(n);
};

export const addDoc = async (colRef, data) => {
  if (isMock) {
    const items = getMockStorage(colRef.name);
    const newId = Math.random().toString(36).substring(2, 11);
    const newItem = {
      id: newId,
      ...data,
      createdAt: data.createdAt || new Date().toISOString()
    };
    items.push(newItem);
    setMockStorage(colRef.name, items);
    return { id: newId };
  }
  return firestore.addDoc(colRef, data);
};

export const updateDoc = async (docRef, data) => {
  if (isMock) {
    const items = getMockStorage(docRef.collectionName);
    const index = items.findIndex(item => item.id === docRef.id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data };
      setMockStorage(docRef.collectionName, items);
    }
    return Promise.resolve();
  }
  return firestore.updateDoc(docRef, data);
};

export const deleteDoc = async (docRef) => {
  if (isMock) {
    const items = getMockStorage(docRef.collectionName);
    const filtered = items.filter(item => item.id !== docRef.id);
    setMockStorage(docRef.collectionName, filtered);
    return Promise.resolve();
  }
  return firestore.deleteDoc(docRef);
};

export const getDoc = async (docRef) => {
  if (isMock) {
    const items = getMockStorage(docRef.collectionName);
    const item = items.find(i => i.id === docRef.id);
    return {
      exists: () => !!item,
      data: () => item,
      id: docRef.id
    };
  }
  return firestore.getDoc(docRef);
};

export const getDocs = async (queryOrColRef) => {
  if (isMock) {
    const colName = queryOrColRef.type === 'collection' 
      ? queryOrColRef.name 
      : queryOrColRef.collectionName;
    let items = getMockStorage(colName);

    if (queryOrColRef.type === 'query') {
      const constraints = queryOrColRef.constraints || [];
      
      // 1. apply 'where' filters
      for (const c of constraints) {
        if (c.type === 'where') {
          const { field, op, value } = c;
          items = items.filter(item => {
            const itemVal = item[field];
            if (op === '==') return itemVal === value;
            if (op === '!=') return itemVal !== value;
            return true;
          });
        }
      }
      
      // 2. apply 'orderBy' sorts
      for (const c of constraints) {
        if (c.type === 'orderBy') {
          const { field, direction } = c;
          items.sort((a, b) => {
            const valA = a[field] || '';
            const valB = b[field] || '';
            if (valA < valB) return direction === 'desc' ? 1 : -1;
            if (valA > valB) return direction === 'desc' ? -1 : 1;
            return 0;
          });
        }
      }
      
      // 3. apply 'limit' size
      for (const c of constraints) {
        if (c.type === 'limit') {
          items = items.slice(0, c.n);
        }
      }
    }

    const docs = items.map(item => ({
      id: item.id,
      data: () => item
    }));

    return {
      docs,
      forEach: (callback) => docs.forEach((doc, idx) => callback(doc, idx)),
      size: docs.length
    };
  }
  return firestore.getDocs(queryOrColRef);
};
