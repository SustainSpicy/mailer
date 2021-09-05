import React, {useState} from 'react'
import './App.css';
import axios from 'axios'

function App() {
const [mail, setMail] = useState({name:'',emailFrom:'',emailTo:'',subject:'',content:'',file:''})


const handleSubmit= async(e)=>{
e.preventDefault();
 const {name,emailFrom,emailTo,subject,content,file} = mail;

// const dataToSubmit = mail;

//to access input element name in the backend
const formData = new FormData();
formData.append('name',name)
formData.append('emailFrom',emailFrom)
formData.append('emailTo',emailTo)
formData.append('subject', subject)
formData.append('content', content)
formData.append('file', file)
const config = {
  headers:{
    'content-type':'multipart/form-data',
  }
}
try {
await axios.post('http://localhost:5000/sendMail', formData,config)
 await alert('Email Sent')
 await console.log('Email Sent')
} catch (err) {
  console.log(err)
}

}
  return (
    <div className="App">
      <header className="App-header">
      <form onSubmit={handleSubmit} >
      
       <input type='text' required id='name' name='name' placeholder='Name' value={mail.name} onChange={(e)=>setMail({...mail,name:e.target.value})}/>
       <input type='email' required id='emailFrom' name='emailFrom' placeholder='Sender' value={mail.emailFrom} onChange={(e)=>setMail({...mail,emailFrom:e.target.value})}/>
       <input type='email' required id='emailTo' name='emailTo' placeholder='Recipients' value={mail.emailTo} onChange={(e)=>setMail({...mail,emailTo:e.target.value})}/>
       <input type='text'  id='subject' name='subject' placeholder='Subject' value={mail.subject} onChange={(e)=>setMail({...mail,subject:e.target.value})}/>
      <textarea name="content" id="content" name='content' placeholder="Mail content" cols="30" rows="10" value={mail.content} onChange={(e)=>setMail({...mail,content:e.target.value})}></textarea>
       <input type='file' id='file' name='file' placeholder='Select file'  onChange={(e)=>setMail({...mail,file:e.target.value})}/>
      
       <button >Send email</button>
      </form>
        
      </header>
    </div>
  );
}

export default App;
