import React from 'react';
import BreakingNews from '../Pages/BreakingNews';
import MatchCards from '../Layout/MatchCards';
import PlayerProfile from '../Pages/PlayerProfile';
import ManagerPage from '../Pages/ManagerPage';
import HeroBanner from '../Pages/HeroBanner';
import ClubHistory from '../Pages/ClubHistory';

const Home = () => {
    return (
        <div>
            <HeroBanner></HeroBanner>
            <BreakingNews></BreakingNews>
            <MatchCards></MatchCards>
            <PlayerProfile></PlayerProfile>
            <ManagerPage></ManagerPage>
            <ClubHistory></ClubHistory>
        </div>
    );
};

export default Home;