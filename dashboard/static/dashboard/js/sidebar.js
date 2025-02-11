document.addEventListener('DOMContentLoaded', function () {
    const sidebarLinks = document.querySelectorAll('.nav-link[data-target]');
    const contentSections = document.querySelectorAll('.content-section');
    const graph = document.querySelectorAll('.graph');
    const defaultContent = document.getElementById('defaultContent');

    sidebarLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const target = this.getAttribute('data-target');
            const targetSection = document.getElementById(target);

            //For hiden the Defuct Content
            contentSections.forEach(function (section) {
                section.style.display = 'none';
            });

            // نمایش بخش انتخاب شده
            if (targetSection) {
                targetSection.style.display = 'block';
            }

            // نمایش یا پنهان کردن بخش پیش‌فرض
            if (defaultContent) {
                defaultContent.style.display = 'none';
            }

            // مدیریت کلاس فعال
            sidebarLinks.forEach(function (lnk) {
                lnk.classList.remove('active');
            });
            this.classList.add('active');

            // بستن accordion (اختیاری)
            const accordion = bootstrap.Accordion.getInstance(document.getElementById('sidebarAccordion'));
            if (accordion) {
                accordion.hide();
            }
        });
    });
});