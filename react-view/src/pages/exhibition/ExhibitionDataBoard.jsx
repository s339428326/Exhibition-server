import Chart from 'chart.js/auto';
import useAuth from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const ExhibitionDataBoard = () => {
  const { data } = useAuth();

  return (
    <div className={`container mx-auto pt-12 px-4`}>
      {/* 統計 chart 參考：https://www.chartjs.org/docs/latest/getting-started/integration.html */}
      <div className=""></div>
    </div>
  );
};

export default ExhibitionDataBoard;
