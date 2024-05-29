import './App.css';
import React, {useState} from "react"
import Header from './components/Header'
import AnimationReveal from './helpers/AnimationRevealPage';
import Roots from './components/Roots'
import Integral from './components/Integral';
function App() {
  const [category, setCategory] = useState('root')

  

  return (
    <div>
      <Header category={category} setCategory={setCategory}/>
      <AnimationReveal key={category}>
        {category === 'root' && <Roots/>}
        {category === 'integral' && <Integral/>}
      </AnimationReveal>
    </div>
  );
}

export default App;
