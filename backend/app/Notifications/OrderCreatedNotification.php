<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderCreatedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Order $order
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
         return (new MailMessage)
            ->subject('تم استلام طلبك')
            ->greeting("مرحبًا {$notifiable->name}")
            ->line("تم إنشاء طلبك بنجاح.")
            ->line("رقم الطلب: {$this->order->order_number}")
            ->line("إجمالي الطلب: {$this->order->total} جنيه")
            ->line('سنبدأ في معالجة طلبك قريبًا.')
            ->salutation('شكرًا لتسوقك معنا ❤️');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
