let stepForm;

window.onload = () => {
    stepForm = new StepForm([
        {
            name: "Email",
            type: "email"
        },
        {
            name: "Password",
            type: "password"
        },
        {
            name: "Submit"
        }
    ]);
};

class StepForm {
    constructor(aSteps) {
        this.iOpenStep = 0;
        this.form = document.getElementById("stepForm");

        this.aSteps = this.createSteps(aSteps);
        this.updateStepDivs();
    }

    createSteps(aSteps) {
        return aSteps.map((oStep, i) => {
            let step = this.createStep(oStep, i);
            
            step.createDOM();
            this.form.appendChild(step.div);

            return step;
        });
    }

    createStep(oStep, i) {
        if (oStep.name == "Submit")
            return new SubmitStep(i);
        else
            return new FormStep(i, oStep.name, oStep.type);
    }

    updateStepDivs() {
        this.aSteps.forEach((step, i) => {
            if (i == this.iOpenStep) {
                step.setVisible();
            } else {
                step.setInvisible();
            }
        });
    }

    onBackBtnPressed() {
        this.iOpenStep--;

        this.updateStepDivs();
    }

    onNextBtnPressed() {
        this.iOpenStep++;

        this.updateStepDivs();
    }
    
    onSubmitBtnPressed() {
        alert(`Personal data was submitted`);
    }

    setStep(i) {
        this.iOpenStep = i;

        this.updateStepDivs();
    }
}

class Step {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    createDOM() {
        let headerDiv = this.createHeaderDiv(this.name);
        this.contentDiv = this.createContentDiv();

        this.div = this.createDiv(this.id, headerDiv, this.contentDiv);
    }

    createHeaderDiv(name) {
        let id = this.id;
        let div = document.createElement("div");
        div.className = "header";
        div.onclick = () => stepForm.setStep(id);
        
        let p = document.createElement("p");
        let spanNumber = document.createElement("span");
        spanNumber.className = "encircle";
        spanNumber.innerHTML = id + 1;
        
        let spanName = document.createElement("span");
        spanName.className = "title";
        spanName.innerHTML = name;

        p.appendChild(spanNumber);
        p.appendChild(spanName);
        div.appendChild(p);

        return div;
    }

    createContentDiv(type) {
        let div = document.createElement("div");
        div.className = "content";
        
        this.appendContent(div);
        this.appendButtons(div);

        return div;
    }

    createPreviousButton() {
        return this.createButton("Back", "onBackBtnPressed");
    }

    createNextButton() {
        return this.createButton("Next", "onNextBtnPressed");
    }

    createButton(text, handlerName) {
        let button = document.createElement("button");
        
        button.onclick = () => stepForm[handlerName]();
        button.setAttribute("type", "button");
        button.innerHTML = text;

        return button;
    }

    createDiv(id, headerDiv, contentDiv) {
        let div = document.createElement("div");
        div.className = "stepDiv";
        div.id = "step" + id;

        div.appendChild(headerDiv);
        div.appendChild(contentDiv);

        return div;
    }
    
    setVisible() {
        this.contentDiv.style.display = "block";
    }

    setInvisible() {
        this.contentDiv.style.display = "none";
    }
}

class FormStep extends Step {
    constructor(id, name, type) {
        super(id, name);
        
        this.type = type;
    }
    
    appendContent(div) {
        let id = "id" + this.name;
        let label = document.createElement("label");
        label.innerHTML = this.name + ": ";
        label.setAttribute("for", id);
        
        div.appendChild(label);

        let input = document.createElement("input");
        input.id = id;
        input.setAttribute("type", this.type);

        div.appendChild(input);
    }

    appendButtons(div) {
        let buttonDiv = document.createElement("div");

        if (this.id > 0) {
            buttonDiv.appendChild(this.createPreviousButton());
        }

        buttonDiv.appendChild(this.createNextButton());

        div.appendChild(buttonDiv);
    }
}

class SubmitStep extends Step {
    constructor(id) {
        super(id, "Submit");
    }
    
    appendContent(div) {
        let p = document.createElement("p");
        p.innerHTML = "Check your inputs before submitting...";
        
        div.appendChild(p);
    }

    appendButtons(div) {
        let buttonDiv = document.createElement("div");
        buttonDiv.appendChild(this.createPreviousButton());
        buttonDiv.appendChild(this.createSubmitButton());

        div.appendChild(buttonDiv);
    }

    createSubmitButton() {
        let button = document.createElement("button");
        
        button.onclick = () => stepForm.onSubmitBtnPressed();
        button.innerHTML = "Submit";
        button.setAttribute("type", "submit");

        return button;
    }
}

function onBackBtn() {
    stepForm.onBackBtnPressed();
}

function onNextBtn() {
    stepForm.onNextBtnPressed();
}

function onSubmitBtn() {
    stepForm.onSubmitBtnPressed();
}