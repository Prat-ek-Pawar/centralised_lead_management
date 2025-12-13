import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import ClientsList from './ClientsList';
import SubmissionsList from './SubmissionsList';
import CreateClient from './CreateClient';
import EditClient from './EditClient';

export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="clients" replace />} />
      <Route path="clients" element={
        <Layout title="Client Management">
          <ClientsList />
        </Layout>
      } />
      <Route path="clients/new" element={
        <Layout title="Create New Client">
          <CreateClient />
        </Layout>
      } />
      <Route path="clients/edit/:id" element={
        <Layout title="Edit Client">
          <EditClient />
        </Layout>
      } />
      <Route path="submissions" element={
        <Layout title="All Form Submissions">
          <SubmissionsList />
        </Layout>
      } />
      <Route path="submissions/client/:clientId" element={
        <Layout title="Client Submissions">
          <SubmissionsList />
        </Layout>
      } />
    </Routes>
  );
}
