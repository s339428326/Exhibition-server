import useAuth from '@/hooks/useAuth';

const PlatformMessage = () => {
  useAuth();
  return <div>PlatformMessage</div>;
};

export default PlatformMessage;
