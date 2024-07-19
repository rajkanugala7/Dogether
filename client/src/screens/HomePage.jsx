export default function Homepage() {
    return (
        <div className="home">
        <div className="navbar ">
            <h1 className="ms-5 mt-1"><span style={{ color: "#FF9839" }}>Do</span>gether</h1>
            <div className="nav-list ">
                <ul >
                    <li><a href="/login" >Sign Up/Register </a></li> 
                    <li><a href="/login">Login</a></li>
                  </ul>
            </div>
            </div>
            <div className="info">
            <div className="container mt-5 col-6">
                <h1>Lets <span style={{ color: "#FF9839" }} >Do</span> it Together</h1>
                    <p>cover a distance by Dogether</p>
                    <form action="/login">
                        <button className="btn btn-primary" >Gets Started</button>
                        </form>
            </div>
            <div className="home-image">
                <img src="/videoAni.avif" alt="" />
                    </div>
                   
            </div>
            
           
            </div>
    )
}