import React from 'react'

const Header = ({addJob, jobForm, goBack, jobPage, job, jobSwitch}) => {
  if(jobPage){
    return (
      <div class="ui segment">
      <h3 class="ui center aligned header">
           <span style={{marginLeft:'30%'}}>{jobSwitch ? job.job.companyName : ''}</span> 
           <span onClick={goBack} class="ui button" style={{marginLeft:'30%'}}> Back  </span> 
      </h3>
    </div>
    )
  } else {
    return (
      <div class="ui segment">
      <h3 class="ui center aligned header">
           <span style={{marginLeft:'30%'}}>{jobForm ? 'Add a job' : 'Select a job'}</span> 
           {jobForm ? <span onClick={goBack} class="ui button" style={{marginLeft:'30%'}}> Back  </span> : <span onClick={addJob} class="ui button" style={{marginLeft:'30%'}}> Add </span>}
      </h3>
    </div>
  )
  }
}

export default Header
