document.addEventListener('DOMContentLoaded', function() {
    const wishList = document.getElementById('wishList');
    const wishInput = document.getElementById('wishInput');
    const addButton = document.getElementById('addButton');
    emailjs.init({
    publicKey: 'FqhdkG3YnbSHJsVXb', // Thay bằng Public Key của bạn
    });

    // Hàm mới: Đặt lại trạng thái toàn bộ phiếu ước nguyện
    function resetFormState() {
    // 1. Xóa tất cả các mục đã có trong danh sách UL
    wishList.innerHTML = ''; 

    // 2. Ẩn thông báo gửi thành công
    statusMessage.style.display = 'none';
    statusMessage.classList.remove('success');

    // 3. Hiển thị lại nút "Gửi Điều ước"
    sendButton.style.display = ''; // Đặt lại thuộc tính display về mặc định
}

    // Hàm tạo một mục Wish List mới
    function createWishItem(text) {
        // Tạo thẻ <li> (mục danh sách)
        const listItem = document.createElement('li');
        listItem.classList.add('wish-item');

        // Thêm nội dung text
        const itemText = document.createElement('span');
        itemText.classList.add('item-text');
        itemText.textContent = text;
        listItem.appendChild(itemText);

        // Tạo khu vực hành động (check và delete)
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        // Nút đánh dấu hoàn thành (Check)
        const checkBtn = document.createElement('i');
        // checkBtn.classList.add('fas', 'fa-check', 'check-btn');
        // checkBtn.addEventListener('click', function() {
        //     // Toggle (chuyển đổi) class 'completed' để áp dụng style line-through
        //     listItem.classList.toggle('completed');
        // });

        // Nút xóa (Delete)
        const deleteBtn = document.createElement('i');
        deleteBtn.classList.add('fas', 'fa-trash', 'delete-btn');
        deleteBtn.addEventListener('click', function() {
            // Xóa mục khỏi danh sách
            wishList.removeChild(listItem);
        });

        // Thêm nút vào khu vực hành động
        actionsDiv.appendChild(checkBtn);
        actionsDiv.appendChild(deleteBtn);

        // Thêm khu vực hành động vào mục danh sách
        listItem.appendChild(actionsDiv);

        return listItem;
    }

    // Hàm xử lý việc thêm mục khi nhấn nút
    function addWish() {
        const text = wishInput.value.trim();
        // 🛑 BƯỚC MỚI: KIỂM TRA VÀ RESET
        // Nếu nút Gửi đang bị ẩn (sendButton.style.display === 'none'), 
        // nghĩa là danh sách cũ đã được gửi. Ta cần reset phiếu.
        if (sendButton.style.display === 'none') {
            resetFormState();
        }
        if (text !== "") {
            // 1. Tạo mục mới
            const newItem = createWishItem(text);
            
            // 2. Thêm vào danh sách (UL)
            wishList.appendChild(newItem);
            
            // 3. Xóa nội dung trong ô input sau khi thêm
            wishInput.value = ""; 
        } else {
            alert("Cậu pé nhập điều ước ik!!!");
        }
    }

    // Gán sự kiện cho nút "Thêm"
    addButton.addEventListener('click', addWish);

    // Gán sự kiện để cho phép thêm bằng phím Enter trong ô input
    wishInput.addEventListener('keypress', function(event) {
        // Kiểm tra nếu phím Enter (key code 13) được nhấn
        if (event.key === 'Enter') {
            addWish();
        }
    });

    // Xóa các mục mẫu ban đầu để tránh trùng lặp khi khởi tạo
    const sampleItem = document.querySelector('.wish-item');
    if (sampleItem) {
        wishList.removeChild(sampleItem);
    }

    // Lấy các phần tử mới
    const sendButton = document.getElementById('sendButton');
    const statusMessage = document.getElementById('statusMessage');

    
    // Hàm xử lý sự kiện Gửi
    sendButton.addEventListener('click', function() {
        
        // 1. Ngăn chặn việc click khi đang ở trạng thái loading
        if (sendButton.classList.contains('loading')) {
            return;
        }
        // KIỂM TRA DANH SÁCH TRỐNG (VALIDATION)
        if (wishList.children.length === 0) {
        
            // Cài đặt style và nội dung cho thông báo lỗi
            statusMessage.classList.remove('success');
            
            // Đặt màu và nội dung cho thông báo lỗi
            alert("Ơ chưa có ước nguyện nào mà cậu!!!");
            return; // Dừng hàm, không chạy loading
        }
        // Lấy danh sách ước nguyện để chuẩn bị cho việc gửi mail
        const wishItems = Array.from(wishList.children).map((li, index) => {
        // Thu thập nội dung và đánh số thứ tự
        return `${index + 1}. ${li.querySelector('.item-text').textContent}`; 
        });

        // Chuyển danh sách thành một chuỗi duy nhất, mỗi mục là một dòng
        const emailContent = wishItems.join('\n'); 

        // Tạo đối tượng chứa các biến sẽ gửi đi
        const templateParams = {

        // Đây là biến mà bạn đã đặt trong Email Template: {{wishlist_content}}
        wishlist_content: emailContent, 
        // Bạn có thể thêm biến recipient_email: 'nguoinhan@example.com' ở đây
        };

        // 2. Bắt đầu Loading (thêm class để hiện spinner)
        sendButton.classList.add('loading');
        statusMessage.classList.remove('success'); // Đảm bảo thông báo cũ bị ẩn
        statusMessage.style.display = 'none';

            // 3. GỌI HÀM GỬI EMAIL VÀ XỬ LÝ KẾT QUẢ
    
    emailjs.send('service_xlmx3wj', 'template_ayowz17', templateParams)
        .then((response) => {
           console.log('EMAIL SENT SUCCESSFULLY!', response.status, response.text);
           
           // Hiển thị thông báo thành công
           statusMessage.textContent = "Điều ước của cậu đã được gửi thành công. Tớ sẽ truyền đạt lại cho ông già noel, hãy check mail nhé! 💌";
           
           // ... (Logic hiển thị thông báo SUCCESS, ẩn nút gửi, ẩn nút xóa - như đã hướng dẫn trước đó) ...
           
           sendButton.classList.remove('loading');
           sendButton.style.display = 'none';
           
           // Ẩn nút xóa
           const deleteButtons = wishList.querySelectorAll('.delete-btn'); 
           deleteButtons.forEach(button => {
               button.style.display = 'none';
           });

           // Hiển thị thông báo
           statusMessage.classList.add('success');
           statusMessage.style.display = 'block';

        }, (error) => {
           console.log('EMAIL FAILED...', error);
           
           // Xử lý khi gửi thất bại
           statusMessage.textContent = "Gửi thất bại. Vui lòng thử lại sau!";
           statusMessage.style.backgroundColor = '#f8d7da';
           statusMessage.style.color = '#721c24'; 
           statusMessage.style.display = 'block';
           sendButton.classList.remove('loading');
        });

        // 3. Mô phỏng quá trình gửi (ví dụ: 2 giây)
        setTimeout(function() {
        
            // 🛑 TẠI ĐÂY: Dữ liệu (wishItems) sẽ được gửi đến Backend để xử lý email 🛑
            // 4. Xử lý sau khi gửi thành công
            
            // Hiện thông báo và áp dụng style thành công
            statusMessage.classList.add('success');
            
            // Kết thúc hiệu ứng loading
            sendButton.classList.remove('loading');

            // Ẩn nút Gửi
            sendButton.style.display = 'none';

            // ẨN TẤT CẢ NÚT XÓA ƯỚC NGUYỆN
            // 1. Tìm tất cả các nút xóa (Giả sử class là .delete-btn)
            const deleteButtons = wishList.querySelectorAll('.delete-btn'); 
            
            // 2. Lặp qua và ẩn từng nút
            deleteButtons.forEach(button => {
                button.style.display = 'none';
            });

        }, 4000); // Đặt độ trễ 2000ms (2 giây) để dễ dàng quan sát hiệu ứng spinner
    });
    
});