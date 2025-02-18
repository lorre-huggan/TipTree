import React, { useState, useEffect } from 'react';
//Components
import Header from '../../components/Header/Header';
import jobService from '../../utils/jobService';
import wageService from '../../utils/wageService';
import WageForm from '../../components/Wage/WageForm';
import WageDetail from '../../components/Wage/WageDetail';
import WageChart from '../../components/Wage/WageChart';
import Calendar from 'react-calendar';

//Styles
import './JobPage.scss';
import './Calender.scss';
import { Container, Wrapper, WageChartContainer } from './JobPage.styles';
import { Header3 } from '../../styles/type';
import Button from '../../components/Form/Button/Button';

const JobPage = ({ handleLogOut }) => {
  const [error, setError] = useState('');
  const [job, setJob] = useState({});
  const [jobSwitch, setJobSwitch] = useState(false);
  const [value, onChange] = useState(new Date());
  const [logIncome, setLogIncome] = useState(false);
  const [wageFormView, setWageFormView] = useState(false);
  const [viewIncome, setViewIncome] = useState(false);
  const [wageData, setWageData] = useState({});
  const [viewBy, setViewBy] = useState('m');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [monday, setMonday] = useState('');
  const [sunday, setSunday] = useState('');
  const [weekView, setWeekView] = useState(false);
  const [monthView, setMonthView] = useState(false);
  const [yearView, setYearView] = useState(false);
  const [data, setData] = useState([]);
  const [submitMsg, setSubmitMsg] = useState(false);

  async function getJob() {
    try {
      const data = await jobService.getJob(
        window.location.pathname.substring(1)
      );
      setJob(data);
      setJobSwitch(true);
      // Route to wherever you want!
    } catch (err) {
      // Invalid user data (probably duplicate email)
      setError(err.message);
    }
  }

  async function getWages() {
    try {
      const data = await wageService.getWages(
        window.location.pathname.substring(1),
        viewBy
      );
      setWageData(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function getGraphData() {
    const month = [];
    month[1] = 'Jan';
    month[2] = 'Feb';
    month[3] = 'Mar';
    month[4] = 'Apr';
    month[5] = 'May';
    month[6] = 'Jun';
    month[7] = 'Jul';
    month[8] = 'Aug';
    month[9] = 'Sep';
    month[10] = 'Oct';
    month[11] = 'Nov';
    month[12] = 'Dec';
    const wage = wageData.wages
      .sort((a, b) => b.date - a.date)
      .map((wage, index) => ({
        name: month[wage.date.slice(6, 7)] + ' ' + wage.date.slice(8, 10),
        wage: wage.wage * wage.hours,
        tips: wage.tips,
        total: wage.tips + wage.wage * wage.hours,
      }));
    setData(wage);
  }
  useEffect(() => {
    getJob();
  }, [jobSwitch]);

  useEffect(() => {
    if (wageData.wages) {
      if (wageData.wages.length > 0) {
        getGraphData();
      }
    }
  }, [wageData]);
  
  useEffect(() => {
    getWages();
    getDate();
  }, [viewBy]);

  if (submitMsg) {
    setTimeout(() => {
      setSubmitMsg(false);
    }, 4000);
  }

  async function wageFormSubmit(wageInfo) {
    const info = {
      wage: wageInfo.wage,
      tips: wageInfo.tips,
      hours: wageInfo.hours,
      date: value,
    };
    try {
      await wageService.createWage(info, window.location.pathname.substring(1));
      // Route to wherever you want!
      setLogIncome(false);
      setWageFormView(false);
      setJobSwitch(true);
      setSubmitMsg(true);
    } catch (err) {
      // Invalid user data (probably duplicate email)
      setError(err.message);
    }
  }

  function goBack() {
    window.history.back();
  }

  function theWageView(select) {
    if (select === 'm') {
      setMonthView(true);
      setWeekView(false);
      setYearView(false);
    } else if (select === 'w') {
      setWeekView(true);
      setMonthView(false);
      setYearView(false);
    } else if (select === 'y') {
      setYearView(true);
      setWeekView(false);
      setMonthView(false);
    }
    setViewBy(select);
  }

  function getDate() {
    const date = new Date(); // 2009-11-10
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.toLocaleString('default', { year: 'numeric' });
    setYear(year);
    setMonth(month);
    let curr = new Date();
    let week = [];
    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i;
      let day = new Date(curr.setDate(first));
      week.push(day);
    }
    let mondayRaw = week[0];
    let sundayRaw = week[6];
    function getFormattedDate(date) {
      let year = date.getFullYear();

      let month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : '0' + month;

      let day = date.getDate().toString();
      day = day.length > 1 ? day : '0' + day;

      return month + '/' + day + '/' + year;
    }
    let mondayFormatted = getFormattedDate(mondayRaw);
    let sundayFormatted = getFormattedDate(sundayRaw);
    setMonday(mondayFormatted);
    setSunday(sundayFormatted);
  }

  if (viewIncome !== true) {
    if (wageFormView !== true) {
      return (
        <>
          {logIncome ? (
            <Header
              handleLogOut={handleLogOut}
              job={job}
              jobSwitch={jobSwitch}
              jobPage={true}
              goBack={() => {
                setLogIncome(false);
              }}
            />
          ) : (
            <Header
              handleLogOut={handleLogOut}
              job={job}
              jobSwitch={jobSwitch}
              jobPage={true}
              goBack={goBack}
            />
          )}

          {submitMsg ? (
            <div className="submit-successful">
              Your form for has been submitted successfully!
            </div>
          ) : (
            ''
          )}
          {logIncome ? (
            ''
          ) : (
            <Wrapper justify="left">
              <Container>
                <Header3 style={{ marginBottom: '2rem' }}>
                  Just finished work?
                </Header3>
                <span
                  onClick={() => {
                    setLogIncome(true);
                  }}
                >
                  <Button label="Log Income" />
                </span>
              </Container>
              <Container>
                <Header3 style={{ marginBottom: '2rem' }}>
                  How much have you earned?
                </Header3>
                <span
                  onClick={() => {
                    setViewIncome(true);
                  }}
                >
                  <Button label="View Income" />
                </span>
              </Container>
            </Wrapper>
          )}
          {logIncome ? <Calendar onChange={onChange} value={value} /> : ''}
          <br />
          {logIncome ? (
            <span
              onClick={() => {
                setWageFormView(true);
              }}
            >
              <Button label="Enter" />
            </span>
          ) : (
            ''
          )}
        </>
      );
    } else {
      return (
        <>
          <Header
            handleLogOut={handleLogOut}
            job={job}
            jobSwitch={jobSwitch}
            jobPage={true}
            goBack={() => {
              setWageFormView(false);
            }}
          />
          <WageForm
            wageFormSubmit={wageFormSubmit}
            dateValue={value.toString()}
          />
        </>
      );
    }
  } else {
    return (
      <>
        <Header
          goBack={() => {
            setViewIncome(false);
          }}
          handleLogOut={handleLogOut}
          job={job}
          jobSwitch={jobSwitch}
          jobPage={true}
        />
        <WageChartContainer >
          <WageChart data={data} />
        </WageChartContainer>

        <WageDetail
          monday={monday}
          sunday={sunday}
          year={year}
          month={month}
          wageData={wageData}
          theWageView={theWageView}
          weekView={weekView}
          monthView={monthView}
          yearView={yearView}
        />
      </>
    );
  }
};
export default JobPage;
