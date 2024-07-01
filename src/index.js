(async function (){
    const data = await fetch('./src/data.json');
    const res = await data.json();

    let employees = res;
    let selectedEmployeeId = employees[0].id;
    let selectedEmployee = employees[0];

    const employeeList = document.querySelector(".employees__names--list");
    const employeeInfo  = document.querySelector(".employees__single--info");

    // Add Employee
    const createEmployee = document.querySelector(".createEmployee");
    const addEmployeeModal = document.querySelector(".addEmployee");
    const addEmployeeForm = document.querySelector(".addEmployee_create");

    //Display add employee form
    createEmployee.addEventListener("click", () => {
        addEmployeeModal.style.display = "flex";
    });

    //Hide add employee form
    addEmployeeModal.addEventListener("click",(e) => {
        if(e.target.className === "addEmployee"){
            addEmployeeModal.style.display = "none";
        }
    });

    const dobInput = document.querySelector('.addEmployee_create--dob');
    dobInput.max = `${new Date().getFullYear() - 18 }
                      - ${new Date().toISOString().slice(5,10)}`;

    // add employee
    addEmployeeForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(addEmployeeForm);
        const values = [...formData.entries()];
        let empData = {};
        
        values.forEach((val) => {
            empData[val[0]] = val[1];
        });

        if(employees.length == 0)
            empData.id = 0;
        else
          empData.id = employees[employees.length - 1].id+1;
        empData.age = new Date().getFullYear() - parseInt(empData.dob.slice(0,4),10);

        empData.imageUrl = empData.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png";
        employees.push(empData);

        renderEmployees();
        addEmployeeForm.reset();
        addEmployeeModal.style.display= "none";
    });

    
    employeeList.addEventListener("click",(e) => {
        // Select Employee
        if(e.target.tagName === 'SPAN' && selectedEmployeeId !== e.target.id){
            selectedEmployeeId = e.target.id;
            renderEmployees();
            //render single employee
            renderSingleEmployee();
        }

        //delete employee
        if(e.target.tagName === "I"){
            employees = employees.filter(
                (emp) => String(emp.id) !== e.target.parentNode.id
            );

            if(String(selectedEmployeeId) === e.target.parentNode.id) {
                selectedEmployeeId = employees[0]? employees[0].id:-1;
                selectedEmployee = employees[0] || {};
                renderSingleEmployee();
            }
            renderEmployees();
        }
    })

    //Render employees list
    const renderEmployees = () => {
        employeeList.innerHTML = "";
        employees.forEach((emp) => {

            const employee = document.createElement("span");
            employee.classList.add("employees__names--item");

            if(parseInt(selectedEmployeeId,10) === emp.id){
                employee.classList.add("selected");
                selectedEmployee = emp;
            }

            employee.setAttribute("id",emp.id);
            employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelelte">❌</i>`;

            employeeList.append(employee);
        });
    };

    //Render Single Employee
    const renderSingleEmployee = ()=>{
        //deleting employee
        if(selectedEmployeeId === -1) {
            employeeInfo.innerHTML = "";
            return;
        }


        employeeInfo.innerHTML = `
        <img src="${selectedEmployee.imageUrl}"/>
        <span class="employees__single--heading">
        ${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
        </span>

        <span>${selectedEmployee.address}</span>
        <span>${selectedEmployee.email}</span>
        <span>Moblie - ${selectedEmployee.contactNumber}</span>
        <span>DOB - ${selectedEmployee.dob}</span>
        `;
    };

    if(selectedEmployee) 
        renderSingleEmployee();
    renderEmployees();
})();