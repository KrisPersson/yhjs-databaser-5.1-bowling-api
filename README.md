# yhjs-databaser-5.1-bowling-api
API for a Bowling Alley
(***School Project***)


**PATHS**

/api/booking

  GET - Finds and returns a specific Booking, based on the provided bookingnumber in request.headers.
  
  POST - Creates a new Booking, based on the request body.
  
    {
      "customerEmail": "kp@gmail.com",  <---- string must be valid email
      "startDate": "2023-06-14",        <---- string must be a date format
      "startTime": 21,                  <---- number Must be between 0 - 23
      "amtPlayers": 4,                  <---- number MUST EQUAL array.length below,     
      "shoeSizes": [42, 39, 45, 40],    <---- [number] array.length MUST EQUAL amtPlayers above
      "requestedAmtOfLanes": 2          <---- number must be > 0
    }
   
  PUT - Finds a Booking based on bookingNumber, and changes amtPlayers and shoeSizes, and/or number of lanes.
  
    {
      "bookingNumber": "4273647...",    <---- string must be existing bookingNumber
      "amtPlayers": 2,                  <---- number MUST EQUAL array.length below,    
      "shoeSizes": [42, 44],            <---- [number] array.length MUST EQUAL amtPlayers above
      "requestedAmtOfLanes": 1          <---- number must be > 0
    }
    
  DELETE - Finds and deletes a Booking based on provided bookingnumber in request.headers.
 
/api/booking/schedule

  GET - Finds and returns all booked time slots for each of the 8 lanes, based on date interval provided in request.headers:
  
    { 
      start_date: 2023-06-10,           <---- string must be valid date
      end_date: 2023-06-15              <----          - | | -
    }
