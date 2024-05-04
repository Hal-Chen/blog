import{_ as e,c as o,o as c,a4 as d}from"./chunks/framework.ClEHkwpW.js";const t="/blog/assets/1.B9yQC_o2.jpeg",a="/blog/assets/2.BXOhKyn2.jpeg",p="/blog/assets/3.6W73dkwn.jpeg",l="/blog/assets/4.Dy0n7Xcn.jpeg",i="/blog/assets/5.DOtCA-9j.jpeg",r="/blog/assets/6.Cfbog_Ze.jpeg",f=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"toolkit/Linux/Linux的IO原理/index.md","filePath":"toolkit/Linux/Linux的IO原理/index.md"}'),s={name:"toolkit/Linux/Linux的IO原理/index.md"},n=d('<h2 id="相关概念" tabindex="-1">相关概念 <a class="header-anchor" href="#相关概念" aria-label="Permalink to &quot;相关概念&quot;">​</a></h2><p>在介绍 <code>I/O</code> 模型之前，我们要首先要知道什么是 <code>I/O</code>？ <code>I/O</code> 是 <code>Input/Output</code> 的缩写，指操作系统中的输入输出操作，从网络中获取或者发送数据也属于 <code>I/O</code> 操作的一种。 我们以网络数据为例看一下整个 <code>I/O</code> 的流程：</p><p><img src="'+t+'" alt=""></p><p>我们从图中可以看到，其实整个过程分为两步：</p><ol><li>内核等待网络数据</li><li>用户进程将数据从内核缓冲区中读取出来</li></ol><p>在 <code>Linux</code> 中，分了五种 <code>I/O</code> 模型，如下图所示：</p><p><img src="'+a+'" alt=""></p><h2 id="阻塞-i-o" tabindex="-1">阻塞 I/O <a class="header-anchor" href="#阻塞-i-o" aria-label="Permalink to &quot;阻塞 I/O&quot;">​</a></h2><p><img src="'+p+'" alt=""></p><p>用户进程调用 <code>recvfrom</code> 函数获取数据，这个时候如果内核没有数据，那么用户进程会一直阻塞在等待数据阶段， 直到数据准备好之后，将数据从内核缓冲区中拷贝到用户缓冲区中。在等待数据的时候，因为用户进程是阻塞的，所以不能做其他的事情</p><p>这就好比你去餐厅吃饭，你一直在后厨等着，知道你的饭菜做好之后才去饭桌吃饭。在等待的期间，你什么事情都不能干</p><h2 id="非阻塞-i-o" tabindex="-1">非阻塞 I/O <a class="header-anchor" href="#非阻塞-i-o" aria-label="Permalink to &quot;非阻塞 I/O&quot;">​</a></h2><p><img src="'+l+'" alt=""></p><p>用户进程通过 <code>recvfrom</code> 从内核获取数据的时候，如果内核的数据没有准备好，用户进程就直接返回， 去干别的事情，过一会儿重新调用 <code>recvfrom</code>，直到内核数据准备好。</p><p>还是以餐厅就餐为例：<br> 我： 服务员，你好，请问我点的餐好了吗？<br> 服务员： 先生，您的餐还没有准备好，请稍等。<br> … 五分钟后…<br> 我： 服务员，你好，请问我点的餐好了吗？<br> 服务员： 先生，您的餐马上就好 <br> … 五分钟后… <br> 我： 服务员，你好，请问我点的餐好了吗？<br> 服务员： 先生，您的餐已经做好了，现在就给您取过来。<br></p><p>每次我问完服务员之后，如果餐尚未做好，我就可以干其他的事情了，比如看会手机，抽支烟，等过几分钟再问一次，直到餐品做好为止</p><h2 id="i-o-多路复用" tabindex="-1">I/O 多路复用 <a class="header-anchor" href="#i-o-多路复用" aria-label="Permalink to &quot;I/O 多路复用&quot;">​</a></h2><p>这里还是以餐厅的场景为例，大家想一下我们平时去餐厅，每个餐厅的服务员数量和顾客数量哪个更多呢？</p><p>答案是显而易见的，肯定是顾客数量多啊。那么这是为啥呢，为什么不为每一个顾客安排一位服务员呢？ 因为给每一位顾客分配一位服务员的人工成本太高了。</p><p>当然，还有一个原因就是：在某一个时间段内，并不是所有的顾客都需要服务员，只是部分顾客才需要， 所以我们并不需要为每一个顾客安排一个服务员。</p><p>在操作系统中也有同样的机制，同时监控很多个 <code>I/O</code> 操作，当一个 <code>I/O</code> 的数据准备好之后，就进行数据的拷贝.</p><p><img src="'+i+'" alt=""></p><p>我们对比一下 <code>I/O</code> 多路复用和餐厅的例子：</p><p><code>epoll</code> 函数就相当于服务员；</p><p>一个 <code>I/O</code> 操作就相当于一个顾客；</p><p>每个服务员服务很多个顾客，对应于一个 <code>epoll</code> 监控多个 <code>I/O</code> 操作；</p><p>如果同时有多个顾客有需求，就对应于同时有多个 <code>I/O</code> 的数据准备好了，这时候服务员要逐个的帮助顾客解决问题， 同样的，操作系统也是逐个的处理每个 <code>I/O</code>。</p><p>讲到这里，大家应该就明白什么是 <code>I/O</code> 多路复用了吧，其实就是同时监控多个 <code>I/O</code> 操作。</p><p><code>Nginx</code> 就是使用了 <code>I/O</code> 多路复用，所以能够达到非常高的并发量。</p><h2 id="异步-i-o" tabindex="-1">异步 I/O <a class="header-anchor" href="#异步-i-o" aria-label="Permalink to &quot;异步 I/O&quot;">​</a></h2><p>我们仍然以餐厅的场景为例来说明异步 <code>I/O</code> 的过程。</p><p>服务员告诉我还要再等一会儿，因为我的餐品还没有完成。这一次呢，我给服务员留了一个电话，当餐备齐之后， 让他给我打电话。这个中间呢，我可以出去干其他事情，不用一直在后厨等，也不用时不时的去问一下，这就是异步过程</p><p><img src="'+r+'" alt=""></p><p>我们看一下上面这张图：当应用进程使用 <code>AIO</code> 函数从内核获取数据，这个时候内核中的数据还没有准备好， 但是 <code>AIO</code> 直接返回了，剩下的工作全部由内核进行完成。在这个过程中，应用进程可以做自己的事情</p><h2 id="信号驱动" tabindex="-1">信号驱动 <a class="header-anchor" href="#信号驱动" aria-label="Permalink to &quot;信号驱动&quot;">​</a></h2><blockquote><p>这个形式的 I/O 很少使用，大家不必过多关注</p></blockquote><p><strong><code>Nginx</code> 使用了 <code>epoll</code>，实现了 <code>I/O</code> 多路复用</strong></p><h2 id="select-和-epoll-的区别" tabindex="-1">select 和 epoll 的区别 <a class="header-anchor" href="#select-和-epoll-的区别" aria-label="Permalink to &quot;select 和 epoll 的区别&quot;">​</a></h2><p><code>select</code> 和 <code>epoll</code>，这两个函数都是 <code>Linux</code> 提供的系统调用，用于完成 <code>I/O</code> 多路复用; <code>select</code> 是早期的 <code>Linux</code>系统用于 <code>I/O</code> 多路复用的一个函数。默认情况下，它可以监控 1024 个 <code>I/O</code>； <code>epoll</code> 是新版 <code>Linux</code> 提供的 <code>I/O</code> 多路复用的系统函数，解决 <code>select</code> 的一些缺点</p><p><code>select</code>函数之后，程序要遍历所有的 <code>I/O</code>，而 <code>epoll</code> 只需要遍历准备好的 <code>I/O</code></p><p>比如我们监控了 1000 个<code>I/O</code>，但是同一时间只有两个<code>I/O</code>准备好了。这个时候如果使用<code>select</code>函数的话， 我们要遍历这 1000 个<code>I/O</code>，找到准备好的 <code>I/O</code>，然后进行相应的操作。 而对于<code>epoll</code>的话，直接就会返回准备好的 <code>I/O</code>，我们只需要处理这两个 <code>I/O</code>就行了。如果同时监控大量<code>I/O</code>的话，效率差别就特别明显了</p>',41),O=[n];function I(h,_,u,b,m,x){return c(),o("div",null,O)}const q=e(s,[["render",I]]);export{f as __pageData,q as default};
