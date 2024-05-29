const Header = ({category, setCategory}) => {
    return(
        <div className="header">
            <button className={category === 'root' ? 'modeButton' : ''} onClick={() => setCategory('root')}>RootQuest</button>
            <button className={category === 'integral' ? 'modeButton' : ''} onClick={() => setCategory('integral')}>IntegralQuest</button>
        </div>
    )
}
export default Header