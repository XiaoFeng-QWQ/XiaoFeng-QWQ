/**
 * 展示独立页面的内容
 */
function showPageHtml() {
    const githubUserName = 'XiaoFeng-QWQ';
    const config = {
        githubUserName: githubUserName,
        currentUrl: window.location.href,
        pageUrl: {
            home: '/',
            blog: '/pages/blog.html',
            projects: '/pages/projects.html',
        },
        pageElement: {
            home: '#page-1 #readme',
            blog: '#page-2 #blog',
            projects: '#page-3',
        },
        githubApiUrl: `https://api.github.com/users/${githubUserName}`,
        githubReadmeUrl: `https://raw.githubusercontent.com/${githubUserName}/${githubUserName}/main/README.md`,
        readmeUrl: '/README.md',
    };

    if (config.currentUrl.endsWith(config.pageUrl.home)) {
        fetchData(config.pageElement.home, config.githubApiUrl, config.readmeUrl);
    } else if (config.currentUrl.endsWith(config.pageUrl.blog)) {
        fetchBlogPosts(config.pageElement.blog);
    }
}

async function fetchData(elementSelector, apiUrl, readmeUrl) {
    try {
        const [userData, readmeData] = await Promise.all([
            fetch(apiUrl).then(res => {
                if (!res.ok) throw new Error('Failed to fetch user data: ' + res.status);
                return res.json();
            }),
            fetch(readmeUrl).then(res => {
                if (!res.ok) throw new Error('Failed to fetch README file: ' + res.status);
                return res.text();
            }),
        ]);

        const html = `
            <img class="mdui-img-circle" style="max-height: 12rem;" src="https://q.qlogo.cn/headimg_dl?dst_uin=1432777209&spec=640&img_type=jpg" />
            <article class="animate__animated animate__fadeInLeft">${marked.parse(readmeData)}</article>
        `;
        $(elementSelector).html(html);
    } catch (error) {
        console.error('Fetch data error:', error);
        const errorHtml = `
            <img class="mdui-img-circle" style="max-height: 12rem;" src="https://q.qlogo.cn/headimg_dl?dst_uin=1432777209&spec=640&img_type=jpg">
            <article class="animate__animated animate__fadeInLeft">
                <h2>Hi there 👋</h2>
                <p>Failed to load data. Please check your network connection.</p>
            </article>
        `;
        $(elementSelector).html(errorHtml);
    }
}

function fetchBlogPosts(elementSelector) {
    $.ajax({
        url: 'https://blog.zicheng.icu/api/posts',
        dataType: 'JSON',
        success: function (data) {
            $(elementSelector).empty();
            const dataSet = data.data.dataSet;

            $.each(dataSet, function (index, item) {
                const postHtml = `
                    <div class="mdui-col-sm-12 mdui-col-md-6 item">
                        <div class="mdui-card box-shadow">
                            <div class="mdui-card-primary">
                                <h2 class="mdui-card-primary-title">${item.title}</h2>
                                <p class="digest mdui-card-primary-subtitle">${item.digest}</p>
                            </div>
                            <div class="mdui-card-actions">
                                <button class="mdui-btn mdui-float-right mdui-ripple mdui-btn-raised" onclick="window.open('${item.url}', '_blank')">阅读完整内容</button>
                            </div>
                            <div class="mdui-card-content">
                                <p>发布日期：${item.date.year}-${item.date.month}-${item.date.day}</p>
                            </div>
                        </div>
                    </div>
                `;

                const postElement = $(postHtml);
                $(elementSelector).append(postElement);
                postElement.hide().delay(index * 100).fadeIn(400).addClass('animate__animated animate__fadeInUp');
            
            });

            const moreHtml = `
                <button class="mdui-btn mdui-center mdui-ripple mdui-btn-raised" onclick="window.open('https://blog.zicheng.icu', '_blank')">查看更多文章</button>
            `;
            $(elementSelector).append(moreHtml);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            const errorMsg = `获取文章列表失败: ${textStatus}, ${errorThrown}`;
            $(elementSelector).append(errorMsg);
        }
    });
}

showPageHtml();