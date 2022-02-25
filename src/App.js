import {useState, useReducer,useEffect, useCallback, useMemo, useRef} from 'react';
import {Container} from 'react-bootstrap';
import NewComponent from './newComponent';
import Hoc from './Hoc';
import './App.css';

const countTotal = (num) => {
    console.log('counting...');
    return num + 10;
}

function reduser(state, action) {
    switch (action.type) {
        case 'toggle':
            return {autoplay: !state.autoplay};
        case 'slow':
            return {autoplay: 300};
        case 'fast':
            return {autoplay: 700};
        default:
            throw new Error();
    }
}


const Slider = (props) => {

    

    // const [state, setState] = useState({slide: 0, autoplay: false});

    // function changeSlide(i) {                                //Можно так!
    //     setState(state => ({...state, slide: state.slide + 1}));
    // }

    // function toggleAutoplay() {
    //     setState(state => ({...state, autoplay: !state.autoplay}));
    // }

    const [slide, setSlide] = useState(0);              //Деструктуризация 1. Состояние(Начальный state) 2. функция, изменяющая состояние 
   // const [autoplay, setAutoplay] = useState(false);
    const [autoplay, dispatch] = useReducer(reduser, {autoplay: false});           //useReduser

    const getSomeImages = useCallback(() => {
        return [
            "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
           //"https://cdn-icons-png.flaticon.com/512/226/226266.png"
        ]
    }, [slide]);

    function logging() {
        console.log('log in');
    }

    useEffect(() => {                                   //Функция вызывается когда компонент обновляется
        document.title = `Slide: ${slide}`              //Каждый раз создается новая функция

        window.addEventListener('click', logging);

        return () => {
            window.removeEventListener('click', logging);
        }
    }, [slide]);                                        //Второй аргумент передаем в массиве за чем будем следить, пустой массив означает что effect сработает один раз


    function changeSlide(i) {                           //Функции изменения наших состояний
        setSlide(slide => slide + i);
    }

    // function toggleAutoplay() {
    //     setAutoplay(autoplay => !autoplay);
    // }

    const total = useMemo(() => {
        return countTotal(slide);
    }, [slide]);

    const style = useMemo(() => ({
            color: slide > 4 ? 'red' : 'black'
    }), [slide])

    useEffect(() => {
        console.log('sttyle')
    }, [style]);
   
    return (
        <Container>
            <div className="slider w-50 m-auto">

                <Slide getSomeImages={getSomeImages}/>

                <div className="text-center mt-5">Active slide {slide} <br/>{autoplay.autoplay ? 'auto' : null}</div>
                <div style={style} className="text-center mt-5">Total slides: {total}</div>
                <div className="buttons mt-3">
                    <button 
                        className="btn btn-primary me-2"
                        onClick={() => changeSlide(-1)}>-1</button>
                    <button 
                        className="btn btn-primary me-2"
                        onClick={() => changeSlide(1)}>+1</button>
                    <button 
                        className="btn btn-primary me-2"
                        onClick={() => dispatch({type: 'toggle'})}>toggle autoplay</button>
                    <button 
                        className="btn btn-primary me-2"
                        onClick={() => dispatch({type: 'slow'})}>slow autoplay</button>
                    <button 
                        className="btn btn-primary me-2"
                        onClick={() => dispatch({type: 'fast'})}>fast autoplay</button>
                </div>
            </div>
        </Container>
    )
}

const Slide = ({getSomeImages}) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        setImages(getSomeImages())
    }, [getSomeImages])

    return (
        <>
            {images.map((url, i) => <img key={i} className="d-block w-100" src={url} alt="slide" />)}
        </>
    )

}

//useRef

function useInputWithValidate(initialValue) {
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
        setValue(e.target.value);
    }

    const validateInput = () => {
        return value.search(/\d/) >= 0 ? true : false;
    }

    return {value, onChange, validateInput};
}

const Form = () => {

    const input = useInputWithValidate('');
    const textArea = useInputWithValidate('');

    

    const color = input.validateInput() ? 'text-danger' : null;

    const myRef = useRef(1);

    useEffect(() => {
        myRef.current++;
        console.log(myRef.current);
    })

    return (
        <Container>
            <form className="w-50 border mt-5 p-3 m-auto">
                <div className="mb-3">
                    <input value={`${input.value} / ${textArea.value}`} type="text" className="form-control" readOnly />
                    <label htmlFor="exampleFormControlInput1" className="form-label mt-3">Email address</label>
                    <input 
                    onChange={input.onChange} 
                    type="email" className={`form-control ${color}`} 
                    value={input.value}
                    id="exampleFormControlInput1" 
                    placeholder="name@example.com"
                    />
                    </div>
                    <div className="mb-3">
                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Example textarea</label>
                    <textarea 
                    onChange={textArea.onChange}
                    value={textArea.value}
                    className="form-control" 
                    id="exampleFormControlTextarea1" 
                    rows="3">

                    </textarea>
                </div>
            </form>
        </Container>
    )
}




function App() {

    const [slider, setSlider] = useState(true);

  return (



    <>
        <button onClick={() => setSlider(false)}>Click delete</button>
        {slider ? <Slider/> : null}

        <Form/>
        <NewComponent/>
        <Hoc/>
    </>

    
        
  );
}

export default App;
