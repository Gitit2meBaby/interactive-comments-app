document.addEventListener('DOMContentLoaded', () => {

    currentUserImage();
    generateCommentContainers();
    generateStoredReplyContainers();

    // get current user Image
    function currentUserImage() {
        fetch('data.json')
            .then((response) => response.json())
            .then((data) => {
                const currentUserImageURL = data.currentUser.image.webp;
                const userImageElements = document.querySelectorAll('.current-user-image');

                userImageElements.forEach((userImageElement) => {
                    userImageElement.src = currentUserImageURL;
                });
            })
            .catch((error) => {
                console.error('Error loading JSON data:', error);
            });
    }

    // get the data from JSON and create containers
    function generateCommentContainers() {
        fetch('data.json')
            .then((response) => response.json())
            .then((data) => {
                const commentsWrapper = document.querySelector(".comments-wrapper");
                // Sort comments by ID in descending order
                const sortedComments = data.comments.sort((a, b) => b.id + a.id);

                // Loop through the sorted comments and create a container for each
                sortedComments.forEach((commentData) => {
                    const commentContainer = document.createElement("div");
                    commentContainer.classList.add("comment-container");
                    commentContainer.setAttribute("data-comment-id", commentData.id);

                    commentContainer.innerHTML = `
                    <div class=message-and-reply-container>

    <div class="container comments">
      <div class="score">
        <div class="score-wrapper">
    <svg class="score-plus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
        <h3 class="score">${commentData.score}</h3>
        <svg class="score-minus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
        </div>
      </div>
        <div class="message-wrapper">
            <div class="message-header">
                <div class="user-and-time">
                    <img class="user-image" src="${commentData.user.image.webp}" alt="user profile picture">
                    <h2 class="user-name">${commentData.user.username}</h2>
                    <h3 class="created">${commentData.createdAt}</h3>
                </div>
                <div class="alter-message-state">
                    <div class="reply">
                        <img src="images/icon-reply.svg" alt="reply arrow">
                        <h3 class="reply-text">Reply</h3>
                    </div>
                </div>
            </div>
            <div class="message">
                <p class="comment">${commentData.content}</p>
            </div>
        </div>
    </div>

    <div class="replies-container">
    </div>
</div>
            `;

                    commentsWrapper.appendChild(commentContainer);
                });
            })
            .catch((error) => {
                console.error('Error loading JSON data:', error);
            });
    }

    // create the dropdown replies section
    function generateReplyContainers(parentCommentContainer, username) {
        const replyDropdownContainer = document.createElement("div");
        replyDropdownContainer.classList.add("container", "reply-dropdown");

        replyDropdownContainer.innerHTML = `
            <div class="profile-image">
                <img class="current-user-image" src="" alt="Your profile picture">
            </div>
            <div class="reply-input">
                <input type="text" name="reply">
            </div>
            <div class="reply-btn-wrapper">
                <button class="reply-btn primary-btn">reply</button>
            </div>
        `;

        const repliesContainer = parentCommentContainer.querySelector('.message-and-reply-container');
        repliesContainer.appendChild(replyDropdownContainer);
        currentUserImage();

        // Set the username in the input field
        const replyInput = replyDropdownContainer.querySelector('input[name="reply"]');
        if (replyInput) {
            replyInput.placeholder = `Reply to @${username}`;
        }
    }

    // create the ability to reply to a reply (not just a message container)
    function replyToReply(repliesContainer, username) {
        const replyInputContainer = document.createElement("div");
        replyInputContainer.classList.add("container", "reply-dropdown");

        replyInputContainer.innerHTML = `
            <div class="profile-image">
                <img class="current-user-image" src="${currentUserImage()}" alt="Your profile picture">
            </div>
            <div class="reply-input">
                <input type="text" name="reply" placeholder="Reply to @${username}">
            </div>
            <div class="reply-btn-wrapper">
                <button class="reply-btn primary-btn">Reply</button>
            </div>
        `;

        repliesContainer.appendChild(replyInputContainer);
    }

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('reply-to-reply')) {
            const parentCommentContainer = event.target.closest('.comment-container');
            if (parentCommentContainer) {
                const repliesContainer = parentCommentContainer.querySelector('.message-and-reply-container');
                if (repliesContainer) {
                    const usernameElement = parentCommentContainer.querySelector('.user-name');
                    if (usernameElement) {
                        const username = usernameElement.textContent;
                        replyToReply(repliesContainer, username);
                        console.log('reply to reply click');
                    }
                }
            }
            const replyInput = parentCommentContainer.querySelector('.reply-input input');
            if (replyInput) {
                replyInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // activate the replies dropdown
    function replyToComment(event) {
        const replyText = event.target;
        const parentCommentContainer = replyText.closest('.comment-container');

        if (parentCommentContainer) {
            const commentId = parentCommentContainer.getAttribute('data-comment-id');

            fetch('data.json')
                .then((response) => response.json())
                .then((data) => {
                    // Find the comment data corresponding to the comment ID
                    const commentData = data.comments.find((comment) => comment.id === parseInt(commentId));

                    if (commentData) {
                        const username = commentData.user.username;
                        generateReplyContainers(parentCommentContainer, username);
                        console.log(username);

                        // Scroll 
                        const replyInput = parentCommentContainer.querySelector('.reply-input input');
                        if (replyInput) {
                            replyInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }

                    }
                })
                .catch((error) => {
                    console.error('Error loading JSON data:', error);
                });
        }
    }


    // update scores with a click
    const commentsWrapper = document.querySelector('.comments-wrapper');
    let currentScore = 0;

    commentsWrapper.addEventListener('click', (event) => {
        if (event.target.classList.contains('reply-text')) {
            replyToComment(event);
        } else if (event.target.classList.contains('score-plus')) {
            const container = event.target.closest('.score-wrapper');
            const scoreDisplay = container.querySelector('.score');
            currentScore = parseInt(scoreDisplay.textContent, 10);
            scoreDisplay.textContent = currentScore + 1;
        } else if (event.target.classList.contains('score-minus')) {
            const container = event.target.closest('.score-wrapper');
            const scoreDisplay = container.querySelector('.score');
            currentScore = parseInt(scoreDisplay.textContent, 10);
            scoreDisplay.textContent = currentScore - 1;
        }
    });

    // commit a reply
    function commitReply(event) {
        if (event.target.classList.contains('reply-btn')) {
            const replyBtn = event.target;
            const replyDropdownContainer = replyBtn.closest('.reply-dropdown');
            const parentCommentContainer = replyDropdownContainer.closest('.comment-container');

            if (replyDropdownContainer && parentCommentContainer) {
                const replyInput = replyDropdownContainer.querySelector('input[name="reply"]');
                const username = replyInput.placeholder.replace('Reply to @', ''); // Extract username from placeholder
                repliedComment(replyDropdownContainer, parentCommentContainer, username);
            } else {
                console.warn('Reply dropdown container not found. Skipping reply operation.');
            }
        }
    }

    document.addEventListener('click', commitReply);

    // turn your reply into a message container (parse the input text)
    function repliedComment(replyDropdownContainer, parentCommentContainer, username) {
        fetch('data.json')
            .then((response) => response.json())
            .then((data) => {
                const replyContent = replyDropdownContainer.querySelector('input[name="reply"]').value;
                replyDropdownContainer.classList.add('hidden');
                const repliesContainer = parentCommentContainer.querySelector('.replies-container');
                const commentContainer = document.createElement("div");
                commentContainer.classList.add("comment-container");


                commentContainer.innerHTML = `
                <div class=message-and-reply-container>
    
                <div class="container comments">
                <div class="score">
                <div class="score-wrapper">
                <svg class="score-plus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
                <h3 class="score">0</h3>
                <svg class="score-minus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
                </div>
                </div>
                <div class="message-wrapper">
                <div class="message-header">
                <div class="user-and-time">
                    <img class="user-image" src="${data.currentUser.image.webp}" alt="user profile picture">
                    <h2 class="user-name">${data.currentUser.username}</h2>
                    <h3 class="created">now</h3>
                </div>
                <div class="alter-message-state">
                    <div class="reply">
                        <img src="images/icon-reply.svg" alt="reply arrow">
                        <h3 class="reply-to-reply">Reply</h3>
                    </div>
                </div>
                </div>
                <div class="message">
                <p class="comment">
                <span class="replying-to">@${username}</span> ${replyContent}
                </p>
                </div>
                </div>
                </div>
                
                <div class="replies-container no-margin">
                </div>
                </div>
                `;

                repliesContainer.appendChild(commentContainer);
            })
            .catch((error) => {
                console.error('Error loading JSON data:', error);
            });
        console.log(username)
    }

    // Select all elements with the class 'reply-btn'
    const replyBtns = document.querySelectorAll('.reply-btn');

    replyBtns.forEach((btn) => {
        btn.addEventListener('click', commitReply);
        console.log('clicked')
    });

    // Get replies from JSON file on page load
    async function generateStoredReplyContainers() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            const commentsWrapper = document.querySelector(".comments-wrapper");

            // Create an array of promises to fetch reply data for each comment
            const replyPromises = data.comments.map(async (commentData) => {
                const repliesContainer = commentsWrapper.querySelector(`[data-comment-id="${commentData.id}"]`);
                if (repliesContainer) {
                    for (const replyData of commentData.replies) {
                        const replyContainer = document.createElement("div");
                        replyContainer.classList.add("comment-container");
                        replyContainer.setAttribute("data-comment-id", commentData.id);


                        replyContainer.innerHTML = `
                            <div class=message-and-reply-container>
                                <div class="container comments">
                                    <div class="score">
                    <div class="score-wrapper">
                    <svg class="score-plus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
                    <h3 class="score">${replyData.score}</h3>
                    <svg class="score-minus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
                    </div>
                    </div>
                    <div class="message-wrapper">
                    <div class="message-header">
                        <div class="user-and-time">
                            <img class="user-image" src="${replyData.user.image.webp}" alt="user profile picture">
                            <div class="you hidden">you</div>
                            <h2 class="user-name">${replyData.user.username}</h2>
                            <h3 class="created">${replyData.createdAt}</h3>
                        </div>
                        <div class="alter-message-state">
                            <div class="delete hidden">
                                <img src="images/icon-delete.svg" alt="trash icon">
                                <h3 class="delete-text">Delete</h3>
                            </div>
                            <div class="reply">
                                <img class="reply-image" src="images/icon-reply.svg" alt="reply arrow">
                                <h3 class="reply-to-reply">Reply</h3>
                            </div>
                        </div>
                    </div>
                    <div class="message">
                    <p class="comment">
                    <span class="replying-to">@${replyData.replyingTo}</span> ${replyData.content}
                </p>
                    </div>
                </div>
            </div>
        `;
                        // Check if the reply belongs to the current user
                        const replyImg = replyContainer.querySelector('.reply-image');

                        if (replyData.user.username === data.currentUser.username) {
                            const you = replyContainer.querySelector('.you');
                            const deleteContainer = replyContainer.querySelector('.delete');
                            const replyText = replyContainer.querySelector('.reply-to-reply');
                            you.classList.remove('hidden');
                            deleteContainer.classList.remove('hidden');
                            replyText.textContent = 'Edit';
                            replyText.classList.add('edit')
                            replyText.classList.remove('reply-to-reply')
                            replyImg.src = "images/icon-edit.svg";
                            replyContainer.classList.add('current');

                        } else if (replyData.user.username !== data.currentUser.username) {
                            replyImg.src = "images/icon-reply.svg";
                        }

                        repliesContainer.querySelector(".replies-container").appendChild(replyContainer);

                    }
                }
            });

            // Wait for all reply data to be fetched and processed
            await Promise.all(replyPromises);
        } catch (error) {
            console.error('Error loading JSON data:', error);
        }
    }


    // modal
    const modal = document.querySelector('.modal');
    const cancelBtn = document.querySelector('#cancelBtn');
    const deleteBtn = document.querySelector('#deleteBtn')

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-text')) {
            modal.classList.remove('hidden');
        }
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // dealing with deleting either a reply or a new post
    let containerToDelete;

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-text')) {
            const currentContainer = event.target.closest('.current');
            const newPostContainer = event.target.closest('.new-post');

            if (currentContainer) {
                containerToDelete = currentContainer;
            } else if (newPostContainer) {
                containerToDelete = newPostContainer;
            }
            modal.classList.remove('hidden');
        }
    });

    deleteBtn.addEventListener('click', () => {
        if (containerToDelete) {
            containerToDelete.remove();
        }
        modal.classList.add('hidden');
    });

    // editing a reply
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit')) {
            const replyContainer = event.target.closest('.comment-container');
            if (replyContainer) {
                editReply(replyContainer);
                console.log('clicked');
            }
        }
    });

    //editing the current users replies (changing the container to include input)
    function editReply(replyContainer) {
        const replyTextElement = replyContainer.querySelector('.comment');
        const currentText = replyTextElement.textContent.trim();

        // Replace the <p> element with a <textarea> for editing
        const inputElement = document.createElement('textarea');
        inputElement.value = currentText;
        inputElement.classList.add('edit-input');
        replyTextElement.replaceWith(inputElement);

        // Add an update button
        const updateBtn = document.createElement('button');
        updateBtn.textContent = 'Update';
        updateBtn.classList.add('update-btn', 'primary-btn');

        // Attach a click event listener to the update button
        updateBtn.addEventListener('click', () => {
            const editedText = inputElement.value;

            // Create a new <p> element for the edited content
            const updatedText = document.createElement('p');
            updatedText.textContent = editedText;

            // Replace the <textarea> with the new <p> element
            inputElement.replaceWith(updatedText);
            updateBtn.remove();
        });

        const messageWrapper = replyContainer.querySelector('.message-wrapper');
        messageWrapper.appendChild(updateBtn);
    }

    // posting a new comment
    const postCommentInput = document.querySelector('#postCommentInput');
    const sendBtn = document.querySelector('#send')

    sendBtn.addEventListener('click', () => {
        postComment().then(() => {
            postCommentInput.value = '';
        });
    })

    //post an original comment from the bottom section
    function postComment() {
        return new Promise((resolve) => {
            fetch('data.json')
                .then((response) => response.json())
                .then((data) => {
                    const postContent = postCommentInput.value;

                    const postContainer = document.createElement("div");
                    postContainer.classList.add("comment-container");
                    postContainer.classList.add("new-post");

                    postContainer.innerHTML = `
            <div class=message-and-reply-container>

            <div class="container comments">
            <div class="score">
            <div class="score-wrapper">
            <svg class="score-plus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
            <h3 class="score">0</h3>
            <svg class="score-minus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
            </div>
            </div>
            <div class="message-wrapper">
            <div class="message-header">
            <div class="user-and-time">
                <img class="user-image" src="${data.currentUser.image.webp}" alt="user profile picture">
                <div class="you">you</div>
                <h2 class="user-name">${data.currentUser.username}</h2>
                <h3 class="created">now</h3>
            </div>
            <div class="alter-message-state">
            <div class="delete delete-comment">
             <img src="images/icon-delete.svg" alt="trash icon">
              <h3 class="delete-text">Delete</h3>
            </div>
                <div class="reply">
                    <img src="images/icon-edit.svg" alt="reply arrow">
                    <h3 class="reply-text edit">Edit</h3>
                </div>
            </div>
            </div>
            <div class="message">
            <p class="comment">${postContent}</p>
            </div>
            </div>
            </div>
            
            <div class="replies-container">
            </div>
            </div>
            `;
                    const commentsWrapper = document.querySelector('.comments-wrapper')
                    commentsWrapper.appendChild(postContainer);
                    resolve();
                })
                .catch((error) => {
                    console.error('Error loading JSON data:', error);
                });
        });

    }

});


