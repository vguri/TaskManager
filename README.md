# TaskManager

A personal task management app for iOS and Android built with React Native and Expo.

## Features

- Add tasks with a title and description
- Mark tasks as complete or active with a single tap
- Delete tasks you no longer need (with a confirmation prompt)
- Tap any task to open a full detail view
- Search tasks by title in real time
- Filter by status: All, Active, or Done
- Tasks are saved locally and survive app restarts
- A motivational quote is loaded from the ZenQuotes API each time you open the app

## Tech stack

- **React Native** with Expo SDK 54
- **TypeScript**
- **React Navigation v7** — native stack navigation
- **AsyncStorage** — local persistence
- **ZenQuotes API** — random motivational quotes

## Getting started

You need Node.js installed and the Expo Go app on your phone.

```bash
git clone <repo-url>
cd TaskManager
npm install
npm start
```

Scan the QR code with Expo Go on Android, or with the Camera app on iOS.

## Project structure

```
src/
├── components/     # TaskCard, SearchBar, FilterTabs, QuoteCard, EmptyState
├── constants/      # Color palette
├── context/        # TaskContext — shared task state and AsyncStorage sync
├── hooks/          # useQuote — fetches from ZenQuotes API
├── navigation/     # Stack navigator
├── screens/        # HomeScreen, TaskDetailScreen, AddTaskScreen
└── types/          # Shared TypeScript types
```

## Public API

The app uses [ZenQuotes](https://zenquotes.io/) (`https://zenquotes.io/api/random`) to fetch a random motivational quote on startup. If the request fails for any reason, a fallback quote is shown so the app never breaks.
