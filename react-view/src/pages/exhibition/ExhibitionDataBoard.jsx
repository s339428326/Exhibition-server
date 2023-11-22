import useAuth from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const ExhibitionDataBoard = () => {
  const { data } = useAuth();
  // const { isShow } = useOutletContext();

  return (
    <div className={`container mx-auto pt-12 px-4`}>
      {/* 統計 chart 參考：https://react-chartjs-2.js.org/examples */}
      <div className="">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia esse
        ex unde ad exercitationem necessitatibus eum dicta minus explicabo
        maiores quod quia, facere laborum aperiam eaque fugiat obcaecati
        laboriosam? Accusantium.
      </div>
    </div>
  );
};

export default ExhibitionDataBoard;
