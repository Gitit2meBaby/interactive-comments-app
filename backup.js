document.addEventListener('DOMContentLoaded', () => {

    currentUserImage();
    generateCommentContainers();
    generateStoredReplyContainers();


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
                    commentContainer.setAttribute("data-comment-id", commentData.id); // Add this line

                    // Create the HTML structure for a comment
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

    function generateReplyContainers(parentCommentContainer) {
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

        const repliesContainer = parentCommentContainer.querySelector('.replies-container');
        repliesContainer.appendChild(replyDropdownContainer);
        currentUserImage()
    }

    function replyToComment(event) {
        const replyText = event.target;
        const parentCommentContainer = replyText.closest('.comment-container');

        if (parentCommentContainer) {
            generateReplyContainers(parentCommentContainer);
        }
    }

    // update score & intitiate reply dropdowns
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

    function commitReply(event) {
        if (event.target.classList.contains('reply-btn')) {
            const replyBtn = event.target;
            const replyDropdownContainer = replyBtn.closest('.reply-dropdown');
            const parentCommentContainer = replyDropdownContainer.closest('.comment-container');

            if (replyDropdownContainer && parentCommentContainer) {
                repliedComment(replyDropdownContainer, parentCommentContainer);
            }
        }
    }

    // Use event delegation to capture clicks on the document
    document.addEventListener('click', commitReply);

    function repliedComment(replyDropdownContainer, parentCommentContainer) {
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
                        <h3 class="reply-text">Reply</h3>
                    </div>
                </div>
                </div>
                <div class="message">
                <p class="comment">@${replyData.replyingTo} ${replyContent}</p>
                </div>
                </div>
                </div>
                
                <div class="replies-container">
                </div>
                </div>
                `;
                repliesContainer.appendChild(commentContainer);
            })
            .catch((error) => {
                console.error('Error loading JSON data:', error);
            });
    }

    // Select all elements with the class 'reply-btn'
    const replyBtns = document.querySelectorAll('.reply-btn');

    // Add click event listeners to each 'reply-btn'
    replyBtns.forEach((btn) => {
        btn.addEventListener('click', commitReply);
        console.log('clicked')
    });


    async function generateStoredReplyContainers() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            const commentsWrapper = document.querySelector(".comments-wrapper");
            console.log('generateStoredReplyContainers function called'); // Add this line
            console.log('Data from JSON file:', data); // Add this line

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
                    <h3 class="score">0</h3>
                    <svg class="score-minus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
                    </div>
                    </div>
                    <div class="message-wrapper">
                    <div class="message-header">
                        <div class="user-and-time">
                            <img class="user-image" src="${replyData.user.image.webp}" alt="user profile picture">
                            <h2 class="user-name">${replyData.user.username}</h2>
                            <h3 class="created">${replyData.createdAt}</h3>
                        </div>
                        <div class="alter-message-state">
                            <div class="reply">
                                <img src="images/icon-reply.svg" alt="reply arrow">
                                <h3 class="reply-text">Reply</h3>
                            </div>
                        </div>
                    </div>
                    <div class="message">
                        <p class="comment">@${replyData.replyingTo} ${replyData.content}</p>
                    </div>
                </div>
            </div>
        `;

                        // Append the reply container to the replies container
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


});







// MOSTLY WORKING AGAIN BUT NEWLY CREATED REPLY NOT

// document.addEventListener('DOMContentLoaded', () => {

//     currentUserImage();
//     generateCommentContainers();
//     generateStoredReplyContainers();


//     function currentUserImage() {
//         fetch('data.json')
//             .then((response) => response.json())
//             .then((data) => {
//                 const currentUserImageURL = data.currentUser.image.webp;
//                 const userImageElements = document.querySelectorAll('.current-user-image');

//                 userImageElements.forEach((userImageElement) => {
//                     userImageElement.src = currentUserImageURL;
//                 });
//             })
//             .catch((error) => {
//                 console.error('Error loading JSON data:', error);
//             });
//     }


//     function generateCommentContainers() {
//         fetch('data.json')
//             .then((response) => response.json())
//             .then((data) => {
//                 const commentsWrapper = document.querySelector(".comments-wrapper");
//                 // Sort comments by ID in descending order
//                 const sortedComments = data.comments.sort((a, b) => b.id + a.id);
    
//                 // Loop through the sorted comments and create a container for each
//                 sortedComments.forEach((commentData) => {
//                     const commentContainer = document.createElement("div");
//                     commentContainer.classList.add("comment-container");
//                     commentContainer.setAttribute("data-comment-id", commentData.id); // Add this line
    
//                     // Create the HTML structure for a comment
//                     commentContainer.innerHTML = `
//                     <div class=message-and-reply-container>

//     <div class="container comments">
//     <div class="score">
//     <div class="score-wrapper">
//     <svg class="score-plus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
//         <h3 class="score">${commentData.score}</h3>
//         <svg class="score-minus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
//     </div>
// </div>
//         <div class="message-wrapper">
//             <div class="message-header">
//                 <div class="user-and-time">
//                     <img class="user-image" src="${commentData.user.image.webp}" alt="user profile picture">
//                     <h2 class="user-name">${commentData.user.username}</h2>
//                     <h3 class="created">${commentData.createdAt}</h3>
//                 </div>
//                 <div class="alter-message-state">
//                     <div class="reply">
//                         <img src="images/icon-reply.svg" alt="reply arrow">
//                         <h3 class="reply-text">Reply</h3>
//                     </div>
//                 </div>
//             </div>
//             <div class="message">
//                 <p class="comment">${commentData.content}</p>
//             </div>
//         </div>
//     </div>

//     <div class="replies-container">
//     </div>
// </div>
//             `;

//                     commentsWrapper.appendChild(commentContainer);
//                 });
//             })
//             .catch((error) => {
//                 console.error('Error loading JSON data:', error);
//             });
//     }

//     function generateReplyContainers(parentCommentContainer) {
//         const replyDropdownContainer = document.createElement("div");
//         replyDropdownContainer.classList.add("container", "reply-dropdown");

//         replyDropdownContainer.innerHTML = `
//             <div class="profile-image">
//               <img class="current-user-image" src="" alt="Your profile picture">
//             </div>
//             <div class="reply-input">
//               <input type="text" name="reply">
//             </div>
//             <div class="reply-btn-wrapper">
//               <button class="reply-btn primary-btn">reply</button>
//             </div>
//         `;

//         const repliesContainer = parentCommentContainer.querySelector('.replies-container');
//         repliesContainer.appendChild(replyDropdownContainer);
//         currentUserImage()
//     }

//     function replyToComment(event) {
//         const replyText = event.target;
//         const parentCommentContainer = replyText.closest('.comment-container');

//         if (parentCommentContainer) {
//             generateReplyContainers(parentCommentContainer);
//         }
//     }

//     // update score & intitiate reply dropdowns
//     const commentsWrapper = document.querySelector('.comments-wrapper');
//     let currentScore = 0;

//     commentsWrapper.addEventListener('click', (event) => {
//         if (event.target.classList.contains('reply-text')) {
//             replyToComment(event);
//         } else if (event.target.classList.contains('score-plus')) {
//             const container = event.target.closest('.score-wrapper');
//             const scoreDisplay = container.querySelector('.score');
//             currentScore = parseInt(scoreDisplay.textContent, 10);
//             scoreDisplay.textContent = currentScore + 1;
//         } else if (event.target.classList.contains('score-minus')) {
//             const container = event.target.closest('.score-wrapper');
//             const scoreDisplay = container.querySelector('.score');
//             currentScore = parseInt(scoreDisplay.textContent, 10);
//             scoreDisplay.textContent = currentScore - 1;
//         }
//     });

//     function commitReply(event) {
//         if (event.target.classList.contains('reply-btn')) {
//             const replyBtn = event.target;
//             const replyDropdownContainer = replyBtn.closest('.reply-dropdown');
//             const parentCommentContainer = replyDropdownContainer.closest('.comment-container');

//             if (replyDropdownContainer && parentCommentContainer) {
//                 repliedComment(replyDropdownContainer, parentCommentContainer);
//             }
//         }
//     }

//     // Use event delegation to capture clicks on the document
//     document.addEventListener('click', commitReply);

//     function repliedComment(replyDropdownContainer, parentCommentContainer) {
//         fetch('data.json')
//             .then((response) => response.json())
//             .then((data) => {
//                 const replyContent = replyDropdownContainer.querySelector('input[name="reply"]').value;

//                 replyDropdownContainer.classList.add('hidden');

//                 const repliesContainer = parentCommentContainer.querySelector('.replies-container');
//                 const commentContainer = document.createElement("div");
//                 commentContainer.classList.add("comment-container");

                
//                 commentContainer.innerHTML = `
//                 <div class=message-and-reply-container>
    
//                 <div class="container comments">
//                 <div class="score">
//                 <div class="score-wrapper">
//                 <svg class="score-plus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
//                 <h3 class="score">0</h3>
//                 <svg class="score-minus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
//                 </div>
//                 </div>
//                 <div class="message-wrapper">
//                 <div class="message-header">
//                 <div class="user-and-time">
//                     <img class="user-image" src="${data.currentUser.image.webp}" alt="user profile picture">
//                     <h2 class="user-name">${data.currentUser.username}</h2>
//                     <h3 class="created">now</h3>
//                 </div>
//                 <div class="alter-message-state">
//                     <div class="reply">
//                         <img src="images/icon-reply.svg" alt="reply arrow">
//                         <h3 class="reply-text">Reply</h3>
//                     </div>
//                 </div>
//                 </div>
//                 <div class="message">
//                 <p class="comment">@${replyData.replyingTo} ${replyContent}</p>
//                 </div>
//                 </div>
//                 </div>
                
//                 <div class="replies-container">
//                 </div>
//                 </div>
//                 `;
//                 repliesContainer.appendChild(commentContainer);
//             })
//             .catch((error) => {
//                 console.error('Error loading JSON data:', error);
//             });
//     }

//     // Select all elements with the class 'reply-btn'
//     const replyBtns = document.querySelectorAll('.reply-btn');

//     // Add click event listeners to each 'reply-btn'
//     replyBtns.forEach((btn) => {
//         btn.addEventListener('click', commitReply);
//         console.log('clicked')
//     });


//     async function generateStoredReplyContainers() {
//         try {
//             const response = await fetch('data.json');
//             const data = await response.json();
//             const commentsWrapper = document.querySelector(".comments-wrapper");
//             console.log('generateStoredReplyContainers function called'); // Add this line
//             console.log('Data from JSON file:', data); // Add this line

//             // Create an array of promises to fetch reply data for each comment
//             const replyPromises = data.comments.map(async (commentData) => {
//                 const repliesContainer = commentsWrapper.querySelector(`[data-comment-id="${commentData.id}"]`);
//                 if (repliesContainer) {
//                     for (const replyData of commentData.replies) {
//                         const replyContainer = document.createElement("div");
//                         replyContainer.classList.add("comment-container");
//                         replyContainer.setAttribute("data-comment-id", commentData.id);

//                         replyContainer.innerHTML = `
//                             <div class=message-and-reply-container>
//                                 <div class="container comments">
//                                     <div class="score">
//                     <div class="score-wrapper">
//                     <svg class="score-plus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
//                     <h3 class="score">0</h3>
//                     <svg class="score-minus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
//                     </div>
//                     </div>
//                     <div class="message-wrapper">
//                     <div class="message-header">
//                         <div class="user-and-time">
//                             <img class="user-image" src="${replyData.user.image.webp}" alt="user profile picture">
//                             <h2 class="user-name">${replyData.user.username}</h2>
//                             <h3 class="created">now</h3>
//                         </div>
//                         <div class="alter-message-state">
//                             <div class="reply">
//                                 <img src="images/icon-reply.svg" alt="reply arrow">
//                                 <h3 class="reply-text">Reply</h3>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="message">
//                         <p class="comment">@${replyData.replyingTo} ${replyData.content}</p>
//                     </div>
//                 </div>
//             </div>
//         `;

//                         // Append the reply container to the replies container
//                         repliesContainer.querySelector(".replies-container").appendChild(replyContainer);
//                     }
//                 }
//             });

//             // Wait for all reply data to be fetched and processed
//             await Promise.all(replyPromises);
//         } catch (error) {
//             console.error('Error loading JSON data:', error);
//         }
//     }


// });





//REPLY DROPDOWN FUNCTION WORKING, BUT NOT THE GENERATE STORED REPLYS

// document.addEventListener('DOMContentLoaded', () => {

//     currentUserImage();
//     generateCommentContainers();


//     function currentUserImage() {
//         fetch('data.json')
//             .then((response) => response.json())
//             .then((data) => {
//                 const currentUserImageURL = data.currentUser.image.webp;
//                 const userImageElements = document.querySelectorAll('.current-user-image');

//                 userImageElements.forEach((userImageElement) => {
//                     userImageElement.src = currentUserImageURL;
//                 });
//             })
//             .catch((error) => {
//                 console.error('Error loading JSON data:', error);
//             });
//     }


//     function generateCommentContainers() {
//         // Fetch the JSON data
//         fetch('data.json')
//             .then((response) => response.json())
//             .then((data) => {
//                 const commentsWrapper = document.querySelector(".comments-wrapper");
//                 // Sort comments by ID in descending order
//                 const sortedComments = data.comments.sort((a, b) => b.id + a.id);

//                 // Loop through the sorted comments and create a container for each
//                 sortedComments.forEach((commentData) => {
//                     const commentContainer = document.createElement("div");
//                     commentContainer.classList.add("comment-container");

//                     // Create the HTML structure for a comment
//                     commentContainer.innerHTML = `
//                     <div class=message-and-reply-container>

//     <div class="container comments">
//     <div class="score">
//     <div class="score-wrapper">
//     <svg class="score-plus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
//         <h3 class="score">${commentData.score}</h3>
//         <svg class="score-minus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
//     </div>
// </div>
//         <div class="message-wrapper">
//             <div class="message-header">
//                 <div class="user-and-time">
//                     <img class="user-image" src="${commentData.user.image.webp}" alt="user profile picture">
//                     <h2 class="user-name">${commentData.user.username}</h2>
//                     <h3 class="created">${commentData.createdAt}</h3>
//                 </div>
//                 <div class="alter-message-state">
//                     <div class="reply">
//                         <img src="images/icon-reply.svg" alt="reply arrow">
//                         <h3 class="reply-text">Reply</h3>
//                     </div>
//                 </div>
//             </div>
//             <div class="message">
//                 <p class="comment">${commentData.content}</p>
//             </div>
//         </div>
//     </div>

//     <div class="replies-container">
//     </div>
// </div>
//             `;

//                     commentsWrapper.appendChild(commentContainer);
//                 });
//             })
//             .catch((error) => {
//                 console.error('Error loading JSON data:', error);
//             });
//     }

//     function generateReplyContainers(parentCommentContainer) {
//         const replyDropdownContainer = document.createElement("div");
//         replyDropdownContainer.classList.add("container", "reply-dropdown");
//         replyDropdownContainer.innerHTML = `
//             <div class="profile-image">
//               <img class="current-user-image" src="" alt="Your profile picture">
//             </div>
//             <div class="reply-input">
//               <input type="text" name="reply">
//             </div>
//             <div class="reply-btn-wrapper">
//               <button class="reply-btn primary-btn">reply</button>
//             </div>
//         `;

//         const repliesContainer = parentCommentContainer.querySelector('.replies-container');
//         repliesContainer.appendChild(replyDropdownContainer);
//         currentUserImage()
//     }

//     function replyToComment(event) {
//         const replyText = event.target;
//         const parentCommentContainer = replyText.closest('.comment-container');

//         if (parentCommentContainer) {
//             generateReplyContainers(parentCommentContainer);
//         }
//     }

//     // update score & intitiate reply dropdowns
//     const commentsWrapper = document.querySelector('.comments-wrapper');
//     let currentScore = 0;

//     commentsWrapper.addEventListener('click', (event) => {
//         if (event.target.classList.contains('reply-text')) {
//             replyToComment(event);
//         } else if (event.target.classList.contains('score-plus')) {
//             const container = event.target.closest('.score-wrapper');
//             const scoreDisplay = container.querySelector('.score');
//             currentScore = parseInt(scoreDisplay.textContent, 10);
//             scoreDisplay.textContent = currentScore + 1;
//         } else if (event.target.classList.contains('score-minus')) {
//             const container = event.target.closest('.score-wrapper');
//             const scoreDisplay = container.querySelector('.score');
//             currentScore = parseInt(scoreDisplay.textContent, 10);
//             scoreDisplay.textContent = currentScore - 1;
//         }
//     });

//     function commitReply(event) {
//         if (event.target.classList.contains('reply-btn')) {
//             const replyBtn = event.target;
//             const replyDropdownContainer = replyBtn.closest('.reply-dropdown');
//             const parentCommentContainer = replyDropdownContainer.closest('.comment-container');

//             if (replyDropdownContainer && parentCommentContainer) {
//                 repliedComment(replyDropdownContainer, parentCommentContainer);
//             }
//         }
//     }

//     // Use event delegation to capture clicks on the document
//     document.addEventListener('click', commitReply);

//     function repliedComment(replyDropdownContainer, parentCommentContainer) {
//         fetch('data.json')
//             .then((response) => response.json())
//             .then((data) => {
//                 const replyContent = replyDropdownContainer.querySelector('input[name="reply"]').value;

//                 replyDropdownContainer.classList.add('hidden');

//                 const repliesContainer = parentCommentContainer.querySelector('.replies-container');
//                 const commentContainer = document.createElement("div");
//                 commentContainer.classList.add("comment-container");

//                 commentContainer.innerHTML = `
//                 <div class=message-and-reply-container>
    
//                 <div class="container comments">
//                 <div class="score">
//                 <div class="score-wrapper">
//                 <svg class="score-plus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
//                 <h3 class="score">0</h3>
//                 <svg class="score-minus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
//                 </div>
//                 </div>
//                 <div class="message-wrapper">
//                 <div class="message-header">
//                 <div class="user-and-time">
//                     <img class="user-image" src="${data.currentUser.image.webp}" alt="user profile picture">
//                     <h2 class="user-name">${data.currentUser.username}</h2>
//                     <h3 class="created">now</h3>
//                 </div>
//                 <div class="alter-message-state">
//                     <div class="reply">
//                         <img src="images/icon-reply.svg" alt="reply arrow">
//                         <h3 class="reply-text">Reply</h3>
//                     </div>
//                 </div>
//                 </div>
//                 <div class="message">
//                 <p class="comment">${replyContent}</p>
//                 </div>
//                 </div>
//                 </div>
                
//                 <div class="replies-container">
//                 </div>
//                 </div>
//                 `;
//                 repliesContainer.appendChild(commentContainer);
//             })
//             .catch((error) => {
//                 console.error('Error loading JSON data:', error);
//             });
//     }

//     // Select all elements with the class 'reply-btn'
//     const replyBtns = document.querySelectorAll('.reply-btn');

//     // Add click event listeners to each 'reply-btn'
//     replyBtns.forEach((btn) => {
//         btn.addEventListener('click', commitReply);
//         console.log('clicked')
//     });
//     async function generateStoredReplyContainers() {
//         try {
//             const response = await fetch('data.json');
//             const data = await response.json();
//             const commentsWrapper = document.querySelector(".comments-wrapper");
//             console.log('generateStoredReplyContainers function called'); // Add this line
//             console.log('Data from JSON file:', data); // Add this line

//             // Create an array of promises to fetch reply data for each comment
//             const replyPromises = data.comments.map(async (commentData) => {
//                 const repliesContainer = commentsWrapper.querySelector(`[data-comment-id="${commentData.id}"]`);
//                 if (repliesContainer) {
//                     for (const replyData of commentData.replies) {
//                         const replyContainer = document.createElement("div");
//                         replyContainer.classList.add("comment-container");
//                         replyContainer.setAttribute("data-comment-id", commentData.id);

//                         replyContainer.innerHTML = `
//                             <div class=message-and-reply-container>
//                                 <div class="container comments">
//                                     <div class="score">
//                     <div class="score-wrapper">
//                     <svg class="score-plus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
//                     <h3 class="score">0</h3>
//                     <svg class="score-minus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
//                     </div>
//                     </div>
//                     <div class="message-wrapper">
//                     <div class="message-header">
//                         <div class="user-and-time">
//                             <img class="user-image" src="${replyData.user.image.webp}" alt="user profile picture">
//                             <h2 class="user-name">${replyData.user.username}</h2>
//                             <h3 class="created">now</h3>
//                         </div>
//                         <div class="alter-message-state">
//                             <div class="reply">
//                                 <img src="images/icon-reply.svg" alt="reply arrow">
//                                 <h3 class="reply-text">Reply</h3>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="message">
//                         <p class="comment">${replyData.content}</p>
//                     </div>
//                 </div>
//             </div>
//         `;

//                         // Append the reply container to the replies container
//                         repliesContainer.querySelector(".replies-container").appendChild(replyContainer);
//                     }
//                 }
//             });

//             // Wait for all reply data to be fetched and processed
//             await Promise.all(replyPromises);
//         } catch (error) {
//             console.error('Error loading JSON data:', error);
//         }
//     }
        

// });














// ruined the dropdown hide and show, but does have the username show
// document.addEventListener('DOMContentLoaded', () => {

//     currentUserImage();
//     generateCommentContainers();
//     generateStoredReplyContainers();


//     function currentUserImage() {
//         fetch('data.json')
//             .then((response) => response.json())
//             .then((data) => {
//                 const currentUserImageURL = data.currentUser.image.webp;
//                 const userImageElements = document.querySelectorAll('.current-user-image');

//                 userImageElements.forEach((userImageElement) => {
//                     userImageElement.src = currentUserImageURL;
//                 });
//             })
//             .catch((error) => {
//                 console.error('Error loading JSON data:', error);
//             });
//     }


//     function generateCommentContainers() {
//         fetch('data.json')
//             .then((response) => response.json())
//             .then((data) => {
//                 const commentsWrapper = document.querySelector(".comments-wrapper");
//                 // Sort comments by ID in descending order
//                 const sortedComments = data.comments.sort((a, b) => b.id + a.id);

//                 // Loop through the sorted comments and create a container for each
//                 sortedComments.forEach((commentData) => {
//                     const commentContainer = document.createElement("div");
//                     commentContainer.classList.add("comment-container");
//                     commentContainer.setAttribute("data-comment-id", commentData.id); // Add this line

//                     // Create the HTML structure for a comment
//                     commentContainer.innerHTML = `
//                     <div class=message-and-reply-container>

//     <div class="container comments">
//     <div class="score">
//     <div class="score-wrapper">
//     <svg class="score-plus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
//         <h3 class="score">${commentData.score}</h3>
//         <svg class="score-minus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
//     </div>
// </div>
//         <div class="message-wrapper">
//             <div class="message-header">
//                 <div class="user-and-time">
//                     <img class="user-image" src="${commentData.user.image.webp}" alt="user profile picture">
//                     <h2 class="user-name">${commentData.user.username}</h2>
//                     <h3 class="created">${commentData.createdAt}</h3>
//                 </div>
//                 <div class="alter-message-state">
//                     <div class="reply">
//                         <img src="images/icon-reply.svg" alt="reply arrow">
//                         <h3 class="reply-text">Reply</h3>
//                     </div>
//                 </div>
//             </div>
//             <div class="message">
//                 <p class="comment">@${commentData.replyingTo} ${commentData.content}</p>
//             </div>
//         </div>
//     </div>

//     <div class="replies-container">
//     </div>
// </div>
//             `;

//                     commentsWrapper.appendChild(commentContainer);
//                 });
//             })
//             .catch((error) => {
//                 console.error('Error loading JSON data:', error);
//             });
//     }

//     function generateReplyContainers(parentCommentContainer) {
//         const replyDropdownContainer = document.createElement("div");
//         replyDropdownContainer.classList.add("container", "reply-dropdown");

//         replyDropdownContainer.innerHTML = `
//             <div class="profile-image">
//               <img class="current-user-image" src="" alt="Your profile picture">
//             </div>
//             <div class="reply-input">
//               <input type="text" name="reply">
//             </div>
//             <div class="reply-btn-wrapper">
//               <button class="reply-btn primary-btn">reply</button>
//             </div>
//         `;

//         const repliesContainer = parentCommentContainer.querySelector('.replies-container');
//         repliesContainer.appendChild(replyDropdownContainer);
//         currentUserImage()
//     }

//     function replyToComment(event) {
//         const replyText = event.target;
//         const parentCommentContainer = replyText.closest('.comment-container');

//         if (parentCommentContainer) {
//             generateReplyContainers(parentCommentContainer);
//         }
//     }

//     // update score & intitiate reply dropdowns
//     const commentsWrapper = document.querySelector('.comments-wrapper');
//     let currentScore = 0;

//     commentsWrapper.addEventListener('click', (event) => {
//         if (event.target.classList.contains('reply-text')) {
//             replyToComment(event);
//         } else if (event.target.classList.contains('score-plus')) {
//             const container = event.target.closest('.score-wrapper');
//             const scoreDisplay = container.querySelector('.score');
//             currentScore = parseInt(scoreDisplay.textContent, 10);
//             scoreDisplay.textContent = currentScore + 1;
//         } else if (event.target.classList.contains('score-minus')) {
//             const container = event.target.closest('.score-wrapper');
//             const scoreDisplay = container.querySelector('.score');
//             currentScore = parseInt(scoreDisplay.textContent, 10);
//             scoreDisplay.textContent = currentScore - 1;
//         }
//     });

//     function commitReply(event) {
//         if (event.target.classList.contains('reply-btn')) {
//             const replyBtn = event.target;
//             const replyDropdownContainer = replyBtn.closest('.reply-dropdown');
//             const parentCommentContainer = replyDropdownContainer.closest('.comment-container');

//             if (replyDropdownContainer && parentCommentContainer) {
//                 repliedComment(replyDropdownContainer, parentCommentContainer);
//             }
//         }
//     }

//     // Use event delegation to capture clicks on the document
//     document.addEventListener('click', commitReply);

//     function repliedComment(replyDropdownContainer, parentCommentContainer) {
//         fetch('data.json')
//             .then((response) => response.json())
//             .then((data) => {
//                 const replyContent = replyDropdownContainer.querySelector('input[name="reply"]').value;

//                 replyDropdownContainer.classList.add('hidden');

//                 const repliesContainer = parentCommentContainer.querySelector('.replies-container');
//                 const commentContainer = document.createElement("div");
//                 commentContainer.classList.add("comment-container");

//                 commentContainer.innerHTML = `
//                 <div class=message-and-reply-container>
    
//                 <div class="container comments">
//                 <div class="score">
//                 <div class="score-wrapper">
//                 <svg class="score-plus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
//                 <h3 class="score">0</h3>
//                 <svg class="score-minus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
//                 </div>
//                 </div>
//                 <div class="message-wrapper">
//                 <div class="message-header">
//                 <div class="user-and-time">
//                     <img class="user-image" src="${data.currentUser.image.webp}" alt="user profile picture">
//                     <h2 class="user-name">${data.currentUser.username}</h2>
//                     <h3 class="created">now</h3>
//                 </div>
//                 <div class="alter-message-state">
//                     <div class="reply">
//                         <img src="images/icon-reply.svg" alt="reply arrow">
//                         <h3 class="reply-text">Reply</h3>
//                     </div>
//                 </div>
//                 </div>
//                 <div class="message">
//                 <p class="comment">@${replyData.replyingTo} ${replyContent}</p>
//                 </div>
//                 </div>
//                 </div>
                
//                 <div class="replies-container">
//                 </div>
//                 </div>
//                 `;
//                 repliesContainer.appendChild(commentContainer);
//             })
//             .catch((error) => {
//                 console.error('Error loading JSON data:', error);
//             });
            
//         }
//     // Select all elements with the class 'reply-btn'
//     const replyBtns = document.querySelectorAll('.reply-btn');

//     // Add click event listeners to each 'reply-btn'
//     replyBtns.forEach((btn) => {
//         btn.addEventListener('click', commitReply);
//         console.log('clicked')
//     });


//     async function generateStoredReplyContainers() {
//         try {
//             const response = await fetch('data.json');
//             const data = await response.json();
//             const commentsWrapper = document.querySelector(".comments-wrapper");
//             console.log('generateStoredReplyContainers function called'); // Add this line
//             console.log('Data from JSON file:', data); // Add this line

//             // Create an array of promises to fetch reply data for each comment
//             const replyPromises = data.comments.map(async (commentData) => {
//                 const repliesContainer = commentsWrapper.querySelector(`[data-comment-id="${commentData.id}"]`);
//                 if (repliesContainer) {
//                     for (const replyData of commentData.replies) {
//                         const replyContainer = document.createElement("div");
//                         replyContainer.classList.add("comment-container");
//                         replyContainer.setAttribute("data-comment-id", commentData.id);

//                         replyContainer.innerHTML = `
//                             <div class=message-and-reply-container>
//                                 <div class="container comments">
//                                     <div class="score">
//                     <div class="score-wrapper">
//                     <svg class="score-plus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
//                     <h3 class="score">0</h3>
//                     <svg class="score-minus" width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
//                     </div>
//                     </div>
//                     <div class="message-wrapper">
//                     <div class="message-header">
//                         <div class="user-and-time">
//                             <img class="user-image" src="${replyData.user.image.webp}" alt="user profile picture">
//                             <h2 class="user-name">${replyData.user.username}</h2>
//                             <h3 class="created">now</h3>
//                         </div>
//                         <div class="alter-message-state">
//                             <div class="reply">
//                                 <img src="images/icon-reply.svg" alt="reply arrow">
//                                 <h3 class="reply-text">Reply</h3>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="message">
//                         <p class="comment">${replyData.content}</p>
//                     </div>
//                 </div>
//             </div>
//         `;

//                         // Append the reply container to the replies container
//                         repliesContainer.querySelector(".replies-container").appendChild(replyContainer);
//                     }
//                 }
//             });

//             // Wait for all reply data to be fetched and processed
//             await Promise.all(replyPromises);
//         } catch (error) {
//             console.error('Error loading JSON data:', error);
//         }
//     }




// });
