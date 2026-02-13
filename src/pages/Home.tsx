import Layout from "../components/layout/Layout";
import FeatureForm from "../components/features/FeatureForm";
import HistoryPanel from "../components/features/HistoryPanel";

export default function Home() {
  return (
    <Layout>
      <div className="py-12">
        <FeatureForm />
        <HistoryPanel />
      </div>
    </Layout>
  );
}
