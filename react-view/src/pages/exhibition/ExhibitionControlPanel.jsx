import useAuth from '@/hooks/useAuth';

const ExhibitionControlPanel = () => {
  const { data } = useAuth();
  return <div>ExhibitionControlPanel</div>;
};

export default ExhibitionControlPanel;
