import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import MySubmissions from './MySubmissions';

export default function ClientDashboard() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="my-submissions" replace />} />
      <Route path="my-submissions" element={
        <Layout title="My Submissions">
          <MySubmissions />
        </Layout>
      } />
    </Routes>
  );
}
