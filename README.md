# Drag & Drop To-Do Board

A simple Kanban-style task manager built with React, Vite, Tailwind CSS, and dnd-kit
.
Tasks can be created, deleted, and dragged across columns, with state saved in localStorage.

## ✨ Features

### ✅ MVP (Completed)

Static Kanban board with 3 columns:

To-Do

In Progress

Completed

Add tasks with a text input

Delete tasks with confirmation modal

Drag & drop tasks between columns and reorder within columns (using dnd-kit)

Persist tasks in browser localStorage

Dark/Light mode toggle with persistence

### 🚧 Enhancements (Planned)

Editable column names and colors

Task detail modal (description, due date, etc.)

Task priority labels (Low, Medium, High)

### 🔮 Advanced Features (Future)

Support for multiple boards

Authentication (Supabase/Firebase)

Cloud database sync

Real-time collaboration (WebSockets / Supabase realtime)

## 🎥 Demo

🖼️ Replace these with your actual screenshots/GIFs once you capture them.

Light Mode

Dark Mode

Drag & Drop

Delete Confirmation

## 🛠️ Tech Stack

[React 19](www.react.dev)

[Vite 7](https://vite.dev/blog/announcing-vite7)

[Tailwind CSS 4](www.tailwindcss.com) with dark mode support

[dnd-kit](https://dndkit.com/) for drag & drop

[Lucide React](https://lucide.dev/guide/packages/lucide-react) for icons

## 🚀 Getting Started

1. Clone & Install
   git clone https://github.com/your-username/drag-drop-todo.git
   cd drag-drop-todo
   npm install

2. Run Dev Server
   npm run dev

Open http://localhost:5173
.

## 📌 Roadmap

- [x] MVP completed

- [x] Editable columns

- [ ] Task details & due dates

- [ ] Priority labels

- [ ] Multiple boards

- [ ] Authentication & DB

- [ ] Real-time sync
