import React, { useEffect, useState } from 'react';
import toast, { Toaster } from "react-hot-toast"

function About() {
  const [newIndex, setNewIndex] = useState(0);
  const [active, setActive] = useState(false);
  const [reviewsContainer, setReviewsContainer] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [img, setImg] = useState("");
  const [location, setLocation] = useState("");
  const [work, setWork] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [add, setAdd] = useState(false);

  const handleNextBtn = () => {
    setNewIndex((prev) => prev + 1);
    setActive(false);
  };

  const handlePreviousBtn = () => {
    setNewIndex((prev) => prev - 1);
    setActive(true);
  };

  useEffect(() => {
    fetch('http://localhost:3001/reviews/getreviews', { withCredentials: true })
      .then(response => response.json())
      .then(data => {
        setReviewsContainer(data)
      })
      .catch(err => console.log(err));
  }, [add])

  function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  const handleAddReview = () => {
    switch (true) {
      case (name == "" || description == "" || email == "" || location == "" || work == ""):
        toast.error("Please fill all the fields")
        break;

      case (!validateEmail(email)):
        toast.error("Enter a valid email address");
        return false;

      case (!(work.toLowerCase() >= 'a' && work.toLowerCase() <= 'z')):
        toast.error("Enter Valid work");
        break;

      case (!(location.toLowerCase() >= 'a' && location.toLowerCase() <= 'z')):
        toast.error("Enter Valid location");
        break;

      default:

        fetch("http://localhost:3001/reviews/addreviews", {
          method: "POST",
          body: JSON.stringify({
            name: name,
            description: description,
            location: location,
            post: work,
            // imgURL: img
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        })
          .then(() => {
            setShowModal(false)
            setName("")
            setDescription("")
            setLocation("")
            setWork("");
            setImg("");
            setAdd(true);
            toast.success("Review Added")
          });
    }
  }

  const handleClose = () => {
    setShowModal(false),
      setName(""),
      setDescription(""),
      setLocation(""),
      setWork(""),
      setImg("")
  }

  return (
    <div className='About dja' id='about'>
      <div className="container dja About-containAll">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12 About-heading">
            <h1>What people say <br /><span style={{ color: '#FA7436' }}>about Us.</span></h1>
            <p>Our Clients send us bunch of smilies with our services and we love them.</p>
            <div className="prenext-btn justify-content-center d-flex">
              <button
                className="btn-previous btn btn-default"
                id='btn-previous'
                disabled={newIndex <= 0}
                style={active ? { backgroundColor: "#FA7436" } : { backgroundColor: "white" }}
                onClick={handlePreviousBtn}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <button
                className="btn-next btn btn-default"
                id='btn-next'
                disabled={newIndex >= reviewsContainer?.length - 1}
                style={!active ? { backgroundColor: "#FA7436" } : { backgroundColor: "white" }}
                onClick={handleNextBtn}
              >
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="About-client1">
              {reviewsContainer?.[newIndex]?.imgURL && <img src={reviewsContainer?.[newIndex]?.imgURL} alt="profile" />}
              <div className="About-review">
                <div>
                  <p className='About-description'>“{reviewsContainer?.[newIndex]?.description}”</p>
                </div>
                <div>
                  <p className='username'>{reviewsContainer?.[newIndex]?.name}</p>
                  <p className='userlocation'>{reviewsContainer?.[newIndex]?.location}</p>
                </div>

              </div>
              {
                reviewsContainer?.length - 1 > newIndex &&
                <div className="About-client2">
                  <p className='username'>{reviewsContainer?.[newIndex + 1]?.name}</p>
                  <p className='userdetail'>{reviewsContainer?.[newIndex + 1]?.post}</p>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="btndiscover dja mt-5">
          <button className="btn btn-primary discover-btn " id='btn-discover' onClick={() => { setShowModal(true) }}>Add Review</button>
        </div>
        {
          showModal && (
            <>
              <div className="modal show text-dark" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                <div className="modal-dialog" role="document">
                  <div className="modal-content">

                    <div className="modal-header">
                      <h5 className="modal-title">Add Reviews</h5>
                      <span aria-hidden="true"><i className="fa-solid fa-xmark" onClick={handleClose}></i></span>
                    </div>

                    <div className="modal-body text-start">
                      Name:<input type="text" className="form-control" value={name} onChange={(evt) => { setName(evt.target.value) }} />
                      Description:<input type="text" className="form-control" value={description} onChange={(evt) => setDescription(evt.target.value)} />
                      Work:<input type="text" className="form-control" value={work} onChange={(evt) => { setWork(evt.target.value) }} />
                      Email:<input type="email" className="form-control" value={email} onChange={(evt) => { setEmail(evt.target.value) }} />
                      Location:<input type="text" className="form-control" value={location} onChange={(evt) => { setLocation(evt.target.value) }} />
                    </div>

                    <div className="modal-footer">

                      <button className="btn btn-success" onClick={handleAddReview}>Add</button>

                      <button type="button" className="btn btn-secondary" onClick={handleClose}>
                        Close
                      </button>
                    </div>

                  </div>
                </div>
              </div>
              <div className="modal-backdrop show"></div>
            </>
          )

        }
      </div>
    </div>
  );
}

export default About;
