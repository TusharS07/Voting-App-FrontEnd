import axios from "axios";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const Voting = () => {
  let navigate = useNavigate();

  const [candidateData, setCandidateData] = useState([]);
  const [candidateID, setCandidateID] = useState(0);
  const [isVoted, setIsVoted] = useState(false);

  useEffect(() => {
    fetchCandidate();
    fetchUserData();
  }, []);

  const fetchCandidate = () => {
    axios
      .get("http://localhost:8081/UserPage/Show_All_Candidates")
      .then((responce) => {
        console.log(responce);
        setCandidateData(responce.data.obj);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fetchUserData = () => {
    axios
      .get(`http://localhost:8081/UserPage/UserData?token=${localStorage.getItem("Token")}`)
      .then((res) => {
        console.log(res);
        setIsVoted(res.data.obj.votingStatus);
        console.log(isVoted);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const vote = () => {
    axios
      .post(`http://localhost:8081/UserPage/Vote?candidateID=${candidateID}&token=${localStorage.getItem("Token")}`)
      .then((res) => {
        toast.success(res.data.message);
        console.log(res);
        fetchUserData();
        console.log(res);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const logoutHandler = () => {
    axios
      .post(
        `http://localhost:8081/UserPage/Logout?token=${localStorage.getItem(
          "Token"
        )}`
      )
      .then((res) => {
        toast.success(res.data.message);
        localStorage.clear();
        setTimeout(() => {
          navigate("/Login");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.response.data);
        console.log(error);
      });
  };

  const handleChange = (event) => {
    setCandidateID(event.target.value);
    console.log(candidateID);
  };

  return (
    <div>

      {isVoted === true &&
      <h1>Voting Completed</h1>}

      {isVoted === false &&
      <div>
      <FormLabel id="demo-controlled-radio-buttons-group">
        Candidate Details
      </FormLabel>
      <br />
      <br />
      {candidateData.length > 0
        ? candidateData.map((record) => {
            return (
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={candidateID}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value={record.candidateId}
                    control={<Radio />}
                    label={record.candidateName}
                  />
                </RadioGroup>
              </FormControl>
            );
          })
        : "No record Found"}
      <Button variant="contained"  onClick={() => vote()}>
        Vote
      </Button>{" "}
      &nbsp; &nbsp;
      
      </div>
      }
      <Button variant="contained" onClick={() => logoutHandler()}>
        Logout
      </Button>
      <ToastContainer autoClose={2000} />
      
    </div>
  );
};

export default Voting;
