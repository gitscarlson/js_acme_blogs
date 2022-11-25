//Function 1 createElemWithText
const createElemWithText = (eleTag = "p", eleText = "", eleClassName) => {
  const newElement = document.createElement(eleTag);
  newElement.textContent = eleText;
  if (eleClassName) newElement.classList.add(eleClassName);
  return newElement;
};

//Function 2 createSelectOptions
const createSelectOptions = (userData) => {
  if (!userData) {
    return undefined;
  }
  const newUserData = [];
  for (let i = 0; i < userData.length; i++) {
    let option = document.createElement("option");
    option.setAttribute("value", userData[i].id);
    option.textContent = userData[i].name;
    newUserData[i] = option;
  }

  return newUserData;
};

//Function 3 toggleCommentSection
const toggleCommentSection = (postID) => {
  if (!postID) {
    return undefined;
  }

  const getCommentSection = document.querySelectorAll("section");
  for (let i = 0; i < getCommentSection.length; i++) {
    const getEleSection = getCommentSection[i];
    if (getEleSection.getAttribute("data-post-id") == postID) {
      getEleSection.classList.toggle("hide");
      return getEleSection;
    }
  }
  return null;
};

//Function 4 toggleCommentButton
const toggleCommentButton = (postID) => {
  if (!postID) return undefined;

  const button = document.querySelectorAll("button");
  for (i = 0; i < button.length; i++) {
    const getButton = button[i];
    if (getButton.getAttribute("data-post-id") == postID) {
      if (getButton.textContent == "Show Comments") {
        getButton.textContent = "Hide Comments";
      } else {
        getButton.textContent = "Show Comments";
      }
      return getButton;
    }
  }
  return null;
};

//Function 5 deleteChildElements
const deleteChildElements = (paramElement) => {
  if (!(paramElement instanceof HTMLElement)) return undefined;

  const child = paramElement;

  while (child.firstChild) {
    child.removeChild(child.lastChild);
    paramElement = child;
  }

  return paramElement;
};

//Function 6 addButtonListeners
const addButtonListeners = () => {
  const buttons = document
    .querySelector("body")
    .querySelector("main")
    .querySelectorAll("button");
    
  for (let i = 0; i < buttons.length; i++) {
    const postId = buttons[i].getAttribute("data-post-id");
    buttons[i].addEventListener(
      "click",
      function (e) {
        toggleComments(e, postId);
      },
      false
    );
  }
  return buttons;
};

//Function 7 removeButtonListeners
const removeButtonListeners = () => {
  const buttons = document.querySelector("body").querySelector("main").querySelectorAll("button");

  for (let i = 0; i < buttons.length; i++) {
    const postId = buttons[i].getAttribute("data-post-id");
    buttons[i].removeEventListener(
      "click",
      function (e) {
        toggleComments(e, postId);
      },
      false
    );
  }

  return buttons;
};

//Function 8 createComments
const createComments = (jsonComments) => {
  if(!jsonComments) return undefined;
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < jsonComments.length; i++) {
    const article = document.createElement("article");
    const header =  createElemWithText('h3', jsonComments[i].name);
    const para = createElemWithText('p', jsonComments[i].body);
    const commentEmail = createElemWithText('p', `From: ${jsonComments[i].email}`);
    article.append(header,para,commentEmail);
    fragment.append(article);
  }

  return fragment;
}

//Function 9 populateSelectMenu
const populateSelectMenu = (jsonUserData) => {
  if(!jsonUserData) return undefined;
  const selectMenu = document.getElementById("selectMenu");
  const selectOption = createSelectOptions(jsonUserData);
  
  for (let i = 0; i < selectOption.length; i++) {
    selectMenu.append(selectOption[i]);
  }
  return selectMenu;
}

//Function 10 getUsers
const getUsers = async () => {
  try {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/");
  if (!response.ok) throw await response.json();
  const allUsers = await response.json();
  return allUsers;
  } catch (e) {
    console.log(e);
  }
}

//Function 11 getUserPosts
const getUserPosts = async (id) => {
  if(!id) return undefined;
  try{
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}/posts`);
    if(!response.ok) throw await response.json();
    const userPosts = await response.json();
    return userPosts;
  } catch (e) {
    console.log(e);
  }
}

//Function 12 getUser
const getUser = async (id) => {
  if(!id) return undefined;
  try{
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if(!response.ok) throw await response.json();
    const singleUser = await response.json();
    return singleUser;
  } catch (e) {
    console.log(e);
  }
}

//Function 13 getPostComments
const getPostComments = async (id) => {
  if(!id) return undefined;
  try{
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`);
    if(!response.ok) throw await response.json();
    const commentById = await response.json();
    return commentById;
  } catch (e) {
    console.log(e);
  }
}

//Function 14 displayComments
const displayComments = async (postId) => {
  if(!postId) return undefined;
  const newSection = document.createElement("section");
  newSection.dataset.postId = postId;
  newSection.classList.add("comments", "hide");
  const comments = await getPostComments(postId);
  const fragment = createComments(comments);
  newSection.append(fragment);

  return newSection;
}

//Function 15 createPosts
const createPosts = async (jsonPost) => {
  if(!jsonPost) return undefined;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < jsonPost.length; i++) {
    const article = document.createElement("article");
    const h2 = createElemWithText('h2', jsonPost[i].title);
    const para = createElemWithText('p', jsonPost[i].body);
    const paraID = createElemWithText('p', `Post ID: ${jsonPost[i].id}`);
    const author = await getUser(jsonPost[i].userId);
    const paraAuthor = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
    const paraCatchPhrase = createElemWithText('p', `${author.company.catchPhrase}`);
    const btnShowComments = createElemWithText("button", "Show Comments");
    btnShowComments.dataset.postId = jsonPost[i].id;
    article.append(h2,para,paraID,paraAuthor,paraCatchPhrase,btnShowComments)
    const section = await displayComments(jsonPost[i].id);
    article.append(section);
    fragment.append(article);
  }
  return fragment;
}

//Function 16 displayPosts
const displayPosts = async (jsonPost) => {
  const mainElement = document.querySelector("main");
  if(jsonPost) {
    const element = await createPosts(jsonPost);
    mainElement.append(element);
    return element;
    console.log(mainElement);
  } else {
    const element = createElemWithText('p', "Select an Employee to display their posts.", 
    "default-text");
    mainElement.append(element);
    return element;
  }
}

//Function 17 toggleComments
const toggleComments = (event, postID) => {
  if(!event && !postID) return undefined;
  event.target.listener = true;
  const toggleSection = toggleCommentSection(postID);
  const toggleButton = toggleCommentButton(postID);
  return [toggleSection, toggleButton];
};

//Function 18 refreshPosts
const refreshPosts = async (jsonPost) => {
  if(!jsonPost) return undefined;
  let removeButtons = removeButtonListeners();
  const main = deleteChildElements(document.querySelector('main'));
  const fragment = await displayPosts(jsonPost);
  let addButtons = addButtonListeners();
  return [removeButtons, main, fragment, addButtons];
}

//Function 19 selectMenuChangeEventHandler
const selectMenuChangeEventHandler = async (e) => {
  document.getElementById("selectMenu").disabled=true;
  const id = e?.target?.value || 1;
  let jsonPost = await getUserPosts(id);
  let refreshPost = await refreshPosts(jsonPost);
  document.getElementById("selectMenu").disabled=false;
  return [id, jsonPost, refreshPost];
}

//Function 20 initPage
const initPage = async () => {
  const users = await getUsers();
  const select = populateSelectMenu(users);
  return [users, select];
}

//Function 21 initApp
const initApp = () => {
  initPage();
  const select = document.getElementById("selectMenu");
  select.addEventListener("change", function (e) {
    selectMenuChangeEventHandler(),false
  });
}

document.addEventListener("DOMContentLoaded", initApp());

//console.log(deleteChildElements(document.querySelector('main')));