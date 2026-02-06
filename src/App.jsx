import { Routes, Route } from 'react-router-dom'
import SearchApp from './components/SearchApp'
import AdminDashboard from './components/AdminDashboard'
import Inquiry from './components/Inquiry'

function App() {
    return (
        <Routes>
            <Route path="/" element={<SearchApp />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/inquiry" element={<Inquiry />} />
        </Routes>
    )
}

export default App
