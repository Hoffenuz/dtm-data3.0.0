import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Universities from './pages/Universities';
import UniversityDetail from './pages/UniversityDetail';
import Scores from './pages/Scores';
import Calculator from './pages/Calculator';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import CareerTest from './pages/CareerTest';
import PrivateUniversities from './pages/PrivateUniversities';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="universities" element={<Universities />} />
        <Route path="universities/:slug" element={<UniversityDetail />} />
        <Route path="scores" element={<Scores />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="news" element={<News />} />
        <Route path="news/:slug" element={<NewsDetail />} />
        <Route path="career-test" element={<CareerTest />} />
        <Route path="private" element={<PrivateUniversities />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
